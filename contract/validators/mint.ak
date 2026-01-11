use aiken/collection/list
use aiken/crypto.{ScriptHash, VerificationKeyHash}
use cardano/address
use cardano/assets.{PolicyId, without_lovelace}
use cardano/transaction.{Transaction}
use contract/types.{Burn, Mint, MintRedeemer}
use contract/utils
use types/cip68

// @validator: Mint
// @title: Open source dynamic assets (Token/NFT) generator (CIP68)
// @description: Validator is used to mint and burn tokens (nft, token) according to CIP68
// @params - platform: The address when users operate with the platform, they will have to pay a platform maintenance fee.
// @params - platform_fee: The minimum amount a user must pay to the platform when interacting with the platform.
// @params - store: The place to store reference tokens of user tokens in nfts minted according to CIP68 of the platform.
validator mint(
  platform: VerificationKeyHash,
  platform_fee: Int,
  store_payment_credential: ScriptHash,
  store_stake_credential: VerificationKeyHash,
  issuer: VerificationKeyHash,
) {
  mint(redeemer: MintRedeemer, policy_id: PolicyId, transaction: Transaction) {
    let Transaction { inputs, outputs, extra_signatories, mint, .. } =
      transaction
    let mint_flatten =
      mint
        |> without_lovelace()
        |> assets.flatten()
    let store_address =
      store_payment_credential
        |> address.from_script()
        |> address.with_delegation_key(store_stake_credential)
    let platform_address = address.from_verification_key(platform)
    when redeemer is {
      Mint -> True
      Burn -> True
    }
  }

  else(_) {
    fail
  }
}
