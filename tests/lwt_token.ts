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
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const { PublicKey, SystemProgram } = anchor.web3;

describe("lwt_token", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.Provider.env());
    const program = anchor.workspace.LwtToken as Program<LwtToken>;

    it("Is initialized!", async () => {
        // Add your test here.

        const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
            "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        );
        const lamports: number =
            await program.provider.connection.getMinimumBalanceForRentExemption(
                MINT_SIZE
            );

        const mintKey: anchor.web3.Keypair = anchor.web3.Keypair.generate();
        const LWTTokenAccount = await getAssociatedTokenAddress(
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
        console.log("Mint key: ", mintKey.publicKey.toString());
        console.log("User: ", program.provider.wallet.publicKey.toString());

        const tx = await program.rpc.mintLwt(new anchor.BN(10000),
            {
                accounts: {
                    mintAuthority: program.provider.wallet.publicKey,
                    mint: mintKey.publicKey,
                    tokenAccount: LWTTokenAccount,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
                    payer: program.provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                },
            },
        );
        console.log("Your transaction signature", tx);
    });
});
