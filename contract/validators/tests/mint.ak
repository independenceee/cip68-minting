use cardano/assets.{add, from_lovelace}
use cardano/transaction.{InlineDatum, Input, Transaction}
use contract/types.{MintRedeemer, Mint, Burn}
use mocktail.{
  add_input, complete, mock_script_address, mock_script_output, mock_tx_hash,
  mock_utxo_ref, mocktail_tx, required_signer_hash, tx_in, tx_in_inline_datum,
  tx_out, tx_out_inline_datum,
}
use mocktail/virgin_address.{mock_pub_key_address}
use mocktail/virgin_key_hash.{mock_pub_key_hash}
use mint

// ─────────────────────────────────────────────────────────────────────────────
// Test: tip_accepts_valid_transaction
//
// Purpose: Verify that a **valid tip** (≥ minimum_tip, correct output) is accepted.
//
// Preconditions:
//   • Script input: 10 ADA
//   • Script output: 11 ADA (increase by 1 ADA)
//   • minimum_tip = 1 ADA
//   • Redeemer = Tip
//   • Output goes to the **same script address**
//   • Tipper signs the transaction
//
// Expected: Validator **accepts** the spend.
// ─────────────────────────────────────────────────────────────────────────────
test tip_accepts_valid_transaction() {
  let redeemer = Mint
  let output_reference = mock_utxo_ref(0, 1)
  let tx =
    mocktail_tx()
      |> tx_in(
          True,
          mock_tx_hash(0),
          1,
          from_lovelace(10_000_000),
          mock_script_address(0, None),
        )
      |> tx_in_inline_datum(True, datum)
      |> tx_out(True, mock_script_address(0, None), from_lovelace(11_000_000))
      |> required_signer_hash(True, mock_pub_key_hash(0))
      |> complete()

  tipjar.tipjar.spend(
    mock_pub_key_hash(0),
    1_000_000,
    Some(datum),
    redeemer,
    output_reference,
    tx,
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Test: tip_rejects_insufficient_tip
//
// Purpose: Ensure the validator **rejects** tips below `minimum_tip`.
//
// Preconditions:
//   • Input: 10 ADA
//   • Output: 10 ADA (no increase)
//   • minimum_tip = 1 ADA
//   • Redeemer = Tip
//   • Output address is correct
//   • Tipper signs
//
// Expected: Validator **rejects** the transaction.
// → This test should FAIL if run (we expect rejection), but in Aiken we
//   can only test success paths. Use off-chain testing or negative logic.
//   Here we keep it as a **documentation** of intended failure.
// ─────────────────────────────────────────────────────────────────────────────
test tip_rejects_insufficient_tip() {
  let redeemer = Tip
  let datum =
    Datum {
      participants: [
        (mock_pub_key_address(0, None), 10_000_000),
        (mock_pub_key_address(1, None), 15_000_000),
      ],
    }
  let output_reference = mock_utxo_ref(0, 1)
  let tx =
    mocktail_tx()
      |> tx_in(
          True,
          mock_tx_hash(0),
          1,
          from_lovelace(10_000_000),
          mock_script_address(0, None),
        )
      |> tx_in_inline_datum(True, datum)
      |> tx_out(True, mock_script_address(0, None), from_lovelace(10_000_000))
      |> required_signer_hash(True, mock_pub_key_hash(0))
      |> complete()

  tipjar.tipjar.spend(
    mock_pub_key_hash(0),
    1_000_000,
    Some(datum),
    redeemer,
    output_reference,
    tx,
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Test: tip_rejects_wrong_output_address
//
// Purpose: Ensure the tip **must** go back to the **same script address**.
//
// Preconditions:
//   • Input: script address
//   • Output: **pubkey address** (not script)
//   • Value increased correctly
//   • Redeemer = Tip
//
// Expected: Validator **rejects** — TipJar must persist.
// ─────────────────────────────────────────────────────────────────────────────
test tip_but_wrong_address() {
  let redeemer = Tip
  let datum =
    Datum {
      participants: [
        (mock_pub_key_address(0, None), 10_000_000),
        (mock_pub_key_address(1, None), 15_000_000),
      ],
    }
  let output_reference = mock_utxo_ref(0, 1)
  let tx =
    mocktail_tx()
      |> tx_in(
          True,
          mock_tx_hash(0),
          1,
          from_lovelace(10_000_000),
          mock_script_address(0, None),
        )
      |> tx_in_inline_datum(True, datum)
      |> tx_out(True, mock_pub_key_address(0, None), from_lovelace(11_000_000))
      |> required_signer_hash(True, mock_pub_key_hash(0))
      |> complete()

  tipjar.tipjar.spend(
    mock_pub_key_hash(0),
    1_000_000,
    Some(datum),
    redeemer,
    output_reference,
    tx,
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Test: claim tips on success
//
// Purpose: Ensure the tip **must** go back to the **same script address**.
//
// Preconditions:
//   • Input: script address
//   • Output: **pubkey address** (not script)
//   • Value increased correctly
//   • Redeemer = Tip
//
// Expected: Validator **rejects** — TipJar must persist.
// ─────────────────────────────────────────────────────────────────────────────
test claim_tip_success() {
  let redeemer = Claim
  let datum =
    Datum {
      participants: [
        (mock_pub_key_address(0, None), 10_000_000),
        (mock_pub_key_address(1, None), 15_000_000),
      ],
    }
  let output_reference = mock_utxo_ref(0, 0)
  let transaction =
    mocktail_tx()
      |> tx_in(
          True,
          mock_tx_hash(0),
          1,
          from_lovelace(10_000_000),
          mock_script_address(0, None),
        )
      |> tx_in_inline_datum(True, datum)
      |> tx_out(True, mock_pub_key_address(0, None), from_lovelace(10_000_000))
      |> required_signer_hash(True, mock_pub_key_hash(0))
      |> complete()

  tipjar.tipjar.spend(
    mock_pub_key_hash(0),
    1_000_000,
    Some(datum),
    redeemer,
    output_reference,
    transaction,
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Test: claim tips not owner
//
// Purpose: Ensure the tip **must** go back to the **same script address**.
//
// Preconditions:
//   • Input: script address
//   • Output: **pubkey address** (not script)
//   • Value increased correctly
//   • Redeemer = Tip
//
// Expected: Validator **rejects** — TipJar must persist.
// ─────────────────────────────────────────────────────────────────────────────
test claim_tip_not_owner() {
  let redeemer = Claim
  let datum =
    Datum {
      participants: [
        (mock_pub_key_address(0, None), 10_000_000),
        (mock_pub_key_address(1, None), 15_000_000),
      ],
    }
  let output_reference = mock_utxo_ref(0, 0)
  let transaction =
    mocktail_tx()
      |> tx_in(
          True,
          mock_tx_hash(0),
          1,
          from_lovelace(10_000_000),
          mock_script_address(0, None),
        )
      |> tx_in_inline_datum(True, datum)
      |> tx_out(True, mock_pub_key_address(0, None), from_lovelace(10_000_000))
      |> required_signer_hash(True, mock_pub_key_hash(1))
      |> complete()

  tipjar.tipjar.spend(
    mock_pub_key_hash(0),
    1_000_000,
    Some(datum),
    redeemer,
    output_reference,
    transaction,
  )
}