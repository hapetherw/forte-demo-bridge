use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("GBogEvSDTdAJudzPy2EcgTqBy1Tmv8wc2gW3b5ynvxAF");

#[program]
pub mod solana_contract {
    use super::*;

    pub fn initialize_lock(
        ctx: Context<InitializeLock>,
        _nft_auth_nonce: u8,
    ) -> Result<()> {
        Ok(())
    }

    pub fn lock_nft(
        ctx: Context<LockNft>
    ) -> Result<()> {
        // transfer the nft to lock account
        token::transfer(
            ctx.accounts.into_transfer_to_pda_context(),
            1,
        )?;
        Ok(())
    }

    pub fn unlock_nft(
        ctx: Context<UnLockNft>,
    ) -> Result<()> {
        
        // transfer the nft to user account
        let (_nft_authority, nft_authority_bump) =
            Pubkey::find_program_address(&[b"vault-stake-auth"], ctx.program_id);

        let authority_seeds = &[&b"vault-stake-auth"[..], &[nft_authority_bump]];

        token::transfer(
            ctx.accounts.into_transfer_to_user_context().with_signer(&[&authority_seeds[..]]),
            1,
        )?;
        
        Ok(())
    }

}

#[derive(Accounts)]
#[instruction(nft_auth_nonce: u8)]
pub struct InitializeLock<'info> {
    #[account(
        init,
        payer = user_account,
        seeds = [
            b"vault-stake".as_ref(),
            nft_mint.key().as_ref(),
            user_account.key().as_ref(),
        ],
        bump,
        token::mint = nft_mint,
        token::authority = nft_authority,
    )]
    pub nft_lock_account: Box<Account<'info, TokenAccount>>,
    
    #[account(
        seeds = [
            b"vault-stake-auth".as_ref(),
        ],
        bump = nft_auth_nonce,
    )]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub nft_authority: UncheckedAccount<'info>,

    // user who lock NFT
    #[account(mut)]
    pub user_account: Signer<'info>,
    // NFT mint account
    pub nft_mint: Box<Account<'info, Mint>>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct LockNft<'info> {
    #[account(
        mut,
        seeds = [
            b"vault-stake".as_ref(),
            user_nft_token_account.mint.as_ref(),
            user_account.key().as_ref(),
        ],
        bump
    )]
    pub nft_lock_account: Box<Account<'info, TokenAccount>>,

    // user who lock NFT
    #[account(mut)]
    pub user_account: Signer<'info>,
    #[account(
        mut,
        constraint = user_nft_token_account.owner == user_account.to_account_info().key()
    )]
    pub user_nft_token_account: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UnLockNft<'info> {
    // user who unlock NFT
    #[account(mut)]
    pub user_account: Signer<'info>,
    #[account(
        mut,
        seeds = [
            b"vault-stake".as_ref(),
            user_nft_token_account.mint.as_ref(),
            user_account.key().as_ref(),
        ],
        bump
    )]
    pub nft_lock_account: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        constraint = user_nft_token_account.owner == user_account.to_account_info().key()
    )]
    pub user_nft_token_account: Box<Account<'info, TokenAccount>>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub nft_auth: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
}

impl<'info> LockNft<'info> {
    fn into_transfer_to_pda_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self
                .user_nft_token_account
                .to_account_info()
                .clone(),
            to: self.nft_lock_account.to_account_info().clone(),
            authority: self.user_account.to_account_info().clone(),
        };
        CpiContext::new(self.token_program.to_account_info().clone(), cpi_accounts)
    }
}

impl<'info> UnLockNft<'info> {
    fn into_transfer_to_user_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self
                .nft_lock_account
                .to_account_info()
                .clone(),
            to: self.user_nft_token_account.to_account_info().clone(),
            authority: self.nft_auth.to_account_info().clone(),
        };
        CpiContext::new(self.token_program.to_account_info().clone(), cpi_accounts)
    }
}