use aiken/crypto.{VerificationKeyHash}
use cardano/address
use cardano/assets.{without_lovelace}
use cardano/transaction.{
  InlineDatum, Output, OutputReference, Transaction, find_input,
}
use cardano/tx
use contract/types.{Remove, StoreRedeemer, Update}
use types/cip68.{CIP68}
use validation/find.{output_by_addr_value}


validator store(
  platform: VerificationKeyHash,
  platform_fee: Int,
  issuer: VerificationKeyHash,
) {
  spend(
    datum: Option<CIP68>,
    redeemer: StoreRedeemer,
    output_reference: OutputReference,
    transaction: Transaction,
  ) {
    expect Some(datum_input) = datum
    let Transaction { inputs, outputs, extra_signatories, .. } = transaction
    let platform_address = address.from_verification_key(platform)
    expect Some(input) = find_input(inputs, output_reference)
    let script_address = input.output.address
    let reference_token =
      input.output.value
        |> without_lovelace()
    let metadatum_input: CIP68 = datum_input
    expect author_input: ByteArray =
      cip68.get(metadatum_input, types.author_key)
    let signed_by_author = tx.verify_signature(extra_signatories, author_input)

    when signed_by_author is {
      False -> False
      True ->
        when redeemer is {        
          Update -> True
          Remove -> True
        }
    }
  }

  else(_) {
    fail
  }
}
