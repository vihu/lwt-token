import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { LwtToken } from "../target/types/lwt_token";
import {
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    createInitializeMintInstruction,
    MINT_SIZE,
} from "@solana/spl-token"; // IGNORE THESE ERRORS IF ANY

describe("lwt_token", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.Provider.env());
    const program = anchor.workspace.LwtToken as Program<LwtToken>;

    const mintKey: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const mint_amt: anchor.BN = new anchor.BN(10000);
    const burn_amt: anchor.BN = new anchor.BN(5000);
    let LWTTokenAccount = null;

    it("Mints 10000 LWT Tokens", async () => {
        // Add your test here.

        const lamports: number =
            await program.provider.connection.getMinimumBalanceForRentExemption(
                MINT_SIZE
            );


        LWTTokenAccount = await getAssociatedTokenAddress(
            mintKey.publicKey,
            program.provider.wallet.publicKey
        );
        console.log("LWT Account: ", LWTTokenAccount.toBase58());

        const mint_tx = new anchor.web3.Transaction().add(
            anchor.web3.SystemProgram.createAccount({
                fromPubkey: program.provider.wallet.publicKey,
                newAccountPubkey: mintKey.publicKey,
                space: MINT_SIZE,
                programId: TOKEN_PROGRAM_ID,
                lamports,
            }),
            createInitializeMintInstruction(
                mintKey.publicKey,
                0,
                program.provider.wallet.publicKey,
                program.provider.wallet.publicKey
            ),
            createAssociatedTokenAccountInstruction(
                program.provider.wallet.publicKey,
                LWTTokenAccount,
                program.provider.wallet.publicKey,
                mintKey.publicKey
            )
        );
        const res = await program.provider.send(mint_tx, [mintKey]);
        console.log(
            await program.provider.connection.getParsedAccountInfo(mintKey.publicKey)
        );

        console.log("Account: ", res);
        console.log("Amount: ", mint_amt);
        console.log("Mint key: ", mintKey.publicKey.toString());
        console.log("User: ", program.provider.wallet.publicKey.toString());

        const tx = await program.rpc.mintLwt(mint_amt,
            {
                accounts: {
                    mintAuthority: program.provider.wallet.publicKey,
                    mint: mintKey.publicKey,
                    to: LWTTokenAccount,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    payer: program.provider.wallet.publicKey,
                    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                },
            },
        );
        console.log("Your transaction signature", tx);
    });

    it("Burns 5000 LWT Tokens", async () => {
        console.log("LWT Account: ", LWTTokenAccount.toBase58());

        const tx = await program.rpc.burnLwt(burn_amt,
            {
                accounts: {
                    mintAuthority: program.provider.wallet.publicKey,
                    mint: mintKey.publicKey,
                    from: LWTTokenAccount,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                },
            },
        );
        console.log("Your transaction signature", tx);
    });
});
