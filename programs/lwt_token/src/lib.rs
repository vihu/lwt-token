use anchor_lang::prelude::*;
use anchor_spl::token;
use anchor_spl::token::{Burn, MintTo};

declare_id!("HMzj7gAjsmr12sRiwjKWkkpX6Ace2Fgu1hrH5xJ6hTSs");

#[program]
pub mod lwt_token {
    use super::*;

    pub fn mint_lwt(ctx: Context<LWTMintTo>, amount: u64) -> Result<()> {
        token::mint_to(ctx.accounts.into(), amount)
    }

    pub fn burn_lwt(ctx: Context<BurnLWT>, amount: u64) -> Result<()> {
        token::burn(ctx.accounts.into(), amount)
    }
}

#[derive(Accounts)]
pub struct LWTMintTo<'info> {
    #[account(signer)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub mint_authority: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub mint: AccountInfo<'info>,
    // #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub token_program: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub to: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub payer: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub rent: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct BurnLWT<'info> {
    #[account(signer)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub mint_authority: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub mint: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub from: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub token_program: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub rent: AccountInfo<'info>,
}

impl<'a, 'b, 'c, 'info> From<&mut BurnLWT<'info>> for CpiContext<'a, 'b, 'c, 'info, Burn<'info>> {
    fn from(accounts: &mut BurnLWT<'info>) -> CpiContext<'a, 'b, 'c, 'info, Burn<'info>> {
        let cpi_accounts = Burn {
            mint: accounts.mint.clone(),
            from: accounts.from.clone(),
            authority: accounts.mint_authority.clone(),
        };
        let cpi_program = accounts.token_program.clone();
        CpiContext::new(cpi_program, cpi_accounts)
    }
}

impl<'a, 'b, 'c, 'info> From<&mut LWTMintTo<'info>>
    for CpiContext<'a, 'b, 'c, 'info, MintTo<'info>>
{
    fn from(accounts: &mut LWTMintTo<'info>) -> CpiContext<'a, 'b, 'c, 'info, MintTo<'info>> {
        let cpi_accounts = MintTo {
            mint: accounts.mint.clone(),
            to: accounts.to.clone(),
            authority: accounts.mint_authority.clone(),
        };
        let cpi_program = accounts.token_program.clone();
        CpiContext::new(cpi_program, cpi_accounts)
    }
}
