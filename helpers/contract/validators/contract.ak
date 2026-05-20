use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Address}
use cardano/assets.{PolicyId}
use cardano/transaction.{OutputReference, Transaction}
use cardano/tx.{verify_signature}
use cocktail/vodka_address.{address_pub_key}
use contract/types.{Burn, Mint, MintRedeemer, Remove, StoreRedeemer, Update}
use contract/utils
use types/cip68.{CIP68}

validator mint(fee: Int, issuer: Address, platform: Address, store: Address) {
  mint(redeemer: MintRedeemer, policy_id: PolicyId, transaction: Transaction) {
    let Transaction { inputs, outputs, extra_signatories, mint, .. } =
      transaction
    let output_platform = utils.find_output(outputs, fee, platform)

    expect Some(owner_pubkey_raw) = address_pub_key(issuer)
    let owner_pubkey: VerificationKeyHash = owner_pubkey_raw
    when redeemer is {
      Mint -> and {
          output_platform != None,
          verify_signature(extra_signatories, owner_pubkey),
        }
      Burn -> and {
          output_platform != None,
          verify_signature(extra_signatories, owner_pubkey),
        }
    }
  }

  else(_) {
    fail
  }
}

validator store(fee: Int, issuer: Address, platform: Address) {
  spend(
    datum_option: Option<CIP68>,
    redeemer: StoreRedeemer,
    output_reference: OutputReference,
    transaction: Transaction,
  ) {
    expect Some(datum_input) = datum_option
    let Transaction { inputs, outputs, extra_signatories, .. } = transaction
    let output_platform = utils.find_output(outputs, fee, platform)
     expect Some(owner_pubkey_raw) = address_pub_key(issuer)
    let owner_pubkey: VerificationKeyHash = owner_pubkey_raw
    when redeemer is {
      Update -> and {
          output_platform != None,
          verify_signature(extra_signatories, owner_pubkey),
        }
      Remove -> and {
          output_platform != None,
          verify_signature(extra_signatories, owner_pubkey),
        }
    }
  }

  else(_) {
    fail
  }
}