use cardano/address.{Address}
use cardano/assets.{PolicyId}
use cardano/transaction.{OutputReference, Transaction}
use contract/types.{
  Burn, Mint, MintRedeemer, Remove, StoreRedeemer,
  Update,
}
use types/cip68.{CIP68}

validator mint(fee: Int, issuer: Address, platform: Address, store: Address) {
  mint(redeemer: MintRedeemer, policy_id: PolicyId, transaction: Transaction) {
    let Transaction { inputs, outputs, extra_signatories, mint, ..} = transaction
    let output_platform = utils.find_output(outputs, fee, platform)
    when redeemer is {
        Mint -> {
            output_platform != None?,
        }
        Burn -> {
            output_platform != None?,
        }
    }
  }

  else(_) {
    fail
  }
}


// @validator: Store
// @title: Open source dynamic assets (Token/NFT) generator CIP68
validator store(fee: Int, issuer: Address, platform: Address) {
  spend(
    datum_option: Option<CIP68>,
    redeemer: StoreRedeemer,
    output_reference: OutputReference,
    transaction: Transaction,
  ) {
    expect Some(datum_input) = datum_option
    let Transaction { inputs, outputs, extra_signatories, ..} = transaction
    let output_platform = utils.find_output(outputs, fee, platform)
    when redeemer is {
        Update -> {
            output_platform != None?,
        }
        Remove -> {
            output_platform != Nonde?,
        }
    }
  }

  else(_) {
    fail
  }
}
