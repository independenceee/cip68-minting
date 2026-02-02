use aiken/crypto.{ScriptHash, VerificationKeyHash}
use cardano/address
use cardano/assets.{PolicyId, add, from_asset, from_lovelace}
use cardano/transaction.{InlineDatum, Input, NoDatum, Transaction}
use cip.{cip68_100, cip68_222}
use contract/types.{Burn, Mint, MintRedeemer, Update}
use mint as mint_validator
use mocktail.{
  add_input, complete, mint, mock_output, mock_policy_id, mock_pub_key_hash,
  mock_script_hash, mock_script_output, mock_utxo_ref, mocktail_tx,
  required_signer_hash, tx_out, tx_out_inline_datum,
}
use types/cip68.{CIP68}

test mint_success() {
  let redeemer: MintRedeemer = Mint
  let platform_fee: Int = 2_000_000
  let policy_id: PolicyId = mock_policy_id(0)
  let asset_name: ByteArray = "Aiken Course 2025"
  let issuer: VerificationKeyHash = mock_pub_key_hash(0)
  let platform: VerificationKeyHash = mock_pub_key_hash(1)
  let store_payment_cred: ScriptHash = mock_script_hash(2)
  let store_stake_cred: VerificationKeyHash = mock_pub_key_hash(3)
  let platform_address = address.from_verification_key(platform)
  let issuer_address = address.from_verification_key(issuer)

  let store_address =
    address.from_script(store_payment_cred)
      |> address.with_delegation_key(store_stake_cred)

  let name_key: Data = "name"
  let name_val: Data = "Aiken Course 2025"
  let image_key: Data = "image"
  let image_val: Data = "ipfs://example.png"
  let type_key: Data = "media_type"
  let type_val: Data = "image/png"
  let author_key: Data = types.author
  let author_val: Data = issuer

  let metadata_items: Pairs<Data, Data> =
    [
      Pair(name_key, name_val), Pair(image_key, image_val),
      Pair(type_key, type_val), Pair(author_key, author_val),
    ]

  let metadata = CIP68 { metadata: metadata_items, version: 1 }

  let datum: Data = metadata

  let tx: Transaction =
    mocktail_tx()
      |> mint(True, 1, policy_id, cip68_100(asset_name))
      |> mint(True, 1, policy_id, cip68_222(asset_name))
      |> tx_out(True, platform_address, from_lovelace(platform_fee + 1_500_000))
      |> tx_out(
          True,
          store_address,
          from_asset(policy_id, cip68_100(asset_name), 1)
            |> add("", "", 2_000_000),
        )
      |> tx_out_inline_datum(True, datum)
      |> tx_out(
          True,
          issuer_address,
          from_asset(policy_id, cip68_222(asset_name), 1)
            |> add("", "", 2_000_000),
        )
      |> required_signer_hash(True, issuer)
      |> complete()

  mint_validator.mint.mint(
    platform_fee,
    issuer,
    platform,
    store_payment_cred,
    store_stake_cred,
    redeemer,
    policy_id,
    tx,
  )
}

test mint_fail_insufficient_fee() {
  let redeemer: MintRedeemer = Mint
  let platform_fee: Int = 2_000_000
  let policy_id: PolicyId = mock_policy_id(0)
  let asset_name: ByteArray = "Aiken Course 2025"
  let issuer: VerificationKeyHash = mock_pub_key_hash(0)
  let platform: VerificationKeyHash = mock_pub_key_hash(1)
  let store_payment_cred: ScriptHash = mock_script_hash(2)
  let store_stake_cred: VerificationKeyHash = mock_pub_key_hash(3)
  let platform_address = address.from_verification_key(platform)
  let issuer_address = address.from_verification_key(issuer)

  let store_address =
    address.from_script(store_payment_cred)
      |> address.with_delegation_key(store_stake_cred)

  let name_key: Data = "name"
  let name_val: Data = "Aiken Course 2025"
  let image_key: Data = "image"
  let image_val: Data = "ipfs://example.png"
  let type_key: Data = "media_type"
  let type_val: Data = "image/png"
  let author_key: Data = types.author
  let author_val: Data = issuer

  let metadata_items: Pairs<Data, Data> =
    [
      Pair(name_key, name_val), Pair(image_key, image_val),
      Pair(type_key, type_val), Pair(author_key, author_val),
    ]

  let metadata = CIP68 { metadata: metadata_items, version: 1 }

  let datum: Data = metadata

  let tx: Transaction =
    mocktail_tx()
      |> mint(True, 1, policy_id, cip68_100(asset_name))
      |> mint(True, 1, policy_id, cip68_222(asset_name))
      |> tx_out(True, platform_address, from_lovelace(500_000))
      |> tx_out(
          True,
          store_address,
          from_asset(policy_id, cip68_100(asset_name), 1)
            |> add("", "", 2_000_000),
        )
      |> tx_out_inline_datum(True, datum)
      |> tx_out(
          True,
          issuer_address,
          from_asset(policy_id, cip68_222(asset_name), 1)
            |> add("", "", 2_000_000),
        )
      |> required_signer_hash(True, issuer)
      |> complete()

  !mint_validator.mint.mint(
    platform_fee,
    issuer,
    platform,
    store_payment_cred,
    store_stake_cred,
    redeemer,
    policy_id,
    tx,
  )
}

test mint_fail_wrong_platform_address() {
  let redeemer: MintRedeemer = Mint
  let platform_fee: Int = 2_000_000
  let policy_id: PolicyId = mock_policy_id(0)
  let asset_name: ByteArray = "Aiken Course 2025"
  let issuer: VerificationKeyHash = mock_pub_key_hash(0)
  let platform: VerificationKeyHash = mock_pub_key_hash(1)
  let store_payment_cred: ScriptHash = mock_script_hash(2)
  let store_stake_cred: VerificationKeyHash = mock_pub_key_hash(3)
  let issuer_address = address.from_verification_key(issuer)

  let store_address =
    address.from_script(store_payment_cred)
      |> address.with_delegation_key(store_stake_cred)

  let name_key: Data = "name"
  let name_val: Data = "Aiken Course 2025"
  let image_key: Data = "image"
  let image_val: Data = "ipfs://example.png"
  let type_key: Data = "media_type"
  let type_val: Data = "image/png"
  let author_key: Data = types.author
  let author_val: Data = issuer

  let metadata_items: Pairs<Data, Data> =
    [
      Pair(name_key, name_val), Pair(image_key, image_val),
      Pair(type_key, type_val), Pair(author_key, author_val),
    ]

  let metadata = CIP68 { metadata: metadata_items, version: 1 }

  let datum: Data = metadata

  let tx: Transaction =
    mocktail_tx()
      |> mint(True, 1, policy_id, cip68_100(asset_name))
      |> mint(True, 1, policy_id, cip68_222(asset_name))
      |> tx_out(True, issuer_address, from_lovelace(platform_fee + 1_500_000))
      |> tx_out(
          True,
          store_address,
          from_asset(policy_id, cip68_100(asset_name), 1)
            |> add("", "", 2_000_000),
        )
      |> tx_out_inline_datum(True, datum)
      |> tx_out(
          True,
          issuer_address,
          from_asset(policy_id, cip68_222(asset_name), 1)
            |> add("", "", 2_000_000),
        )
      |> required_signer_hash(True, issuer)
      |> complete()

  !mint_validator.mint.mint(
    platform_fee,
    issuer,
    platform,
    store_payment_cred,
    store_stake_cred,
    redeemer,
    policy_id,
    tx,
  )
}

test mint_fail_missing_issuer_sig() {
  let redeemer: MintRedeemer = Mint
  let platform_fee: Int = 2_000_000
  let policy_id: PolicyId = mock_policy_id(0)
  let asset_name: ByteArray = "Aiken Course 2025"
  let issuer: VerificationKeyHash = mock_pub_key_hash(0)
  let platform: VerificationKeyHash = mock_pub_key_hash(1)
  let store_payment_cred: ScriptHash = mock_script_hash(2)
  let store_stake_cred: VerificationKeyHash = mock_pub_key_hash(3)
  let platform_address = address.from_verification_key(platform)
  let issuer_address = address.from_verification_key(issuer)

  let store_address =
    address.from_script(store_payment_cred)
      |> address.with_delegation_key(store_stake_cred)

  let name_key: Data = "name"
  let name_val: Data = "Aiken Course 2025"
  let image_key: Data = "image"
  let image_val: Data = "ipfs://example.png"
  let type_key: Data = "media_type"
  let type_val: Data = "image/png"
  let author_key: Data = types.author
  let author_val: Data = issuer

  let metadata_items: Pairs<Data, Data> =
    [
      Pair(name_key, name_val), Pair(image_key, image_val),
      Pair(type_key, type_val), Pair(author_key, author_val),
    ]

  let metadata = CIP68 { metadata: metadata_items, version: 1 }

  let datum: Data = metadata

  let tx: Transaction =
    mocktail_tx()
      |> mint(True, 1, policy_id, cip68_100(asset_name))
      |> mint(True, 1, policy_id, cip68_222(asset_name))
      |> tx_out(True, platform_address, from_lovelace(platform_fee + 1_500_000))
      |> tx_out(
          True,
          store_address,
          from_asset(policy_id, cip68_100(asset_name), 1)
            |> add("", "", 2_000_000),
        )
      |> tx_out_inline_datum(True, datum)
      |> tx_out(
          True,
          issuer_address,
          from_asset(policy_id, cip68_222(asset_name), 1)
            |> add("", "", 2_000_000),
        )
      |> required_signer_hash(False, issuer)
      |> complete()

  !mint_validator.mint.mint(
    platform_fee,
    issuer,
    platform,
    store_payment_cred,
    store_stake_cred,
    redeemer,
    policy_id,
    tx,
  )
}

test mint_fail_invalid_cip68_structure() {
  let redeemer: MintRedeemer = Mint
  let platform_fee: Int = 2_000_000
  let policy_id: PolicyId = mock_policy_id(0)
  let asset_name: ByteArray = "Aiken Course 2025"
  let issuer: VerificationKeyHash = mock_pub_key_hash(0)
  let platform: VerificationKeyHash = mock_pub_key_hash(1)
  let store_payment_cred: ScriptHash = mock_script_hash(2)
  let store_stake_cred: VerificationKeyHash = mock_pub_key_hash(3)
  let platform_address = address.from_verification_key(platform)
  let issuer_address = address.from_verification_key(issuer)

  let store_address =
    address.from_script(store_payment_cred)
      |> address.with_delegation_key(store_stake_cred)

  let name_key: Data = "name"
  let name_val: Data = "Aiken Course 2025"
  let image_key: Data = "image"
  let image_val: Data = "ipfs://example.png"
  let type_key: Data = "media_type"
  let type_val: Data = "image/png"
  let author_key: Data = types.author
  let author_val: Data = issuer

  let metadata_items: Pairs<Data, Data> =
    [
      Pair(name_key, name_val), Pair(image_key, image_val),
      Pair(type_key, type_val), Pair(author_key, author_val),
    ]

  let metadata = metadata_items

  let datum: Data = metadata

  let tx: Transaction =
    mocktail_tx()
      |> mint(True, 1, policy_id, cip68_100(asset_name))
      |> mint(True, 1, policy_id, cip68_222(asset_name))
      |> tx_out(True, platform_address, from_lovelace(platform_fee + 1_500_000))
      |> tx_out(
          True,
          store_address,
          from_asset(policy_id, cip68_100(asset_name), 1)
            |> add("", "", 2_000_000),
        )
      |> tx_out_inline_datum(True, datum)
      |> tx_out(
          True,
          issuer_address,
          from_asset(policy_id, cip68_222(asset_name), 1)
            |> add("", "", 2_000_000),
        )
      |> required_signer_hash(True, issuer)
      |> complete()

  !mint_validator.mint.mint(
    platform_fee,
    issuer,
    platform,
    store_payment_cred,
    store_stake_cred,
    redeemer,
    policy_id,
    tx,
  )
}

test burn_success_with_reference() {
  let redeemer: MintRedeemer = Burn
  let platform_fee: Int = 2_000_000
  let policy_id: PolicyId = mock_policy_id(0)
  let asset_name: ByteArray = "Aiken Course 2025"
  let issuer: VerificationKeyHash = mock_pub_key_hash(0)
  let platform: VerificationKeyHash = mock_pub_key_hash(1)
  let store_payment_cred: ScriptHash = mock_script_hash(2)
  let store_stake_cred: VerificationKeyHash = mock_pub_key_hash(3)
  let platform_address = address.from_verification_key(platform)
  let issuer_address = address.from_verification_key(issuer)
  let output_reference = mock_utxo_ref(0, 1)

  let store_address =
    address.from_script(store_payment_cred)
      |> address.with_delegation_key(store_stake_cred)

  let name_key: Data = "name"
  let name_val: Data = "Aiken Course 2025"
  let image_key: Data = "image"
  let image_val: Data = "ipfs://example.png"
  let type_key: Data = "media_type"
  let type_val: Data = "image/png"
  let author_key: Data = types.author
  let author_val: Data = issuer

  let metadata_items: Pairs<Data, Data> =
    [
      Pair(name_key, name_val), Pair(image_key, image_val),
      Pair(type_key, type_val), Pair(author_key, author_val),
    ]

  let metadata = CIP68 { metadata: metadata_items, version: 1 }

  let datum: Data = metadata

  let tx: Transaction =
    mocktail_tx()
      |> mint(True, -1, policy_id, cip68_100(asset_name))
      |> mint(True, -1, policy_id, cip68_222(asset_name))
      |> tx_out(True, issuer_address, from_lovelace(4_000_000))
      |> tx_out(True, platform_address, from_lovelace(platform_fee + 1_500_000))
      |> required_signer_hash(True, issuer)
      |> complete()
      |> add_input(
          True,
          Input {
            output_reference,
            output: mock_script_output(
              store_address,
              from_asset(policy_id, cip68_100(asset_name), 1)
                |> add("", "", 2_000_000),
              InlineDatum(Some(datum)),
            ),
          },
        )
      |> add_input(
          True,
          Input {
            output_reference,
            output: mock_output(
              issuer_address,
              from_asset(policy_id, cip68_222(asset_name), 1)
                |> add("", "", 2_000_000),
              NoDatum,
              None,
            ),
          },
        )

  mint_validator.mint.mint(
    platform_fee,
    issuer,
    platform,
    store_payment_cred,
    store_stake_cred,
    redeemer,
    policy_id,
    tx,
  )
}

test burn_success_user_token_only() {
  let redeemer: MintRedeemer = Burn
  let platform_fee: Int = 2_000_000
  let policy_id: PolicyId = mock_policy_id(0)
  let asset_name: ByteArray = "Aiken Course 2025"
  let issuer: VerificationKeyHash = mock_pub_key_hash(0)
  let platform: VerificationKeyHash = mock_pub_key_hash(1)
  let store_payment_cred: ScriptHash = mock_script_hash(2)
  let store_stake_cred: VerificationKeyHash = mock_pub_key_hash(3)
  let platform_address = address.from_verification_key(platform)
  let issuer_address = address.from_verification_key(issuer)
  let output_reference = mock_utxo_ref(0, 1)

  let store_address =
    address.from_script(store_payment_cred)
      |> address.with_delegation_key(store_stake_cred)

  let name_key: Data = "name"
  let name_val: Data = "Aiken Course 2025"
  let image_key: Data = "image"
  let image_val: Data = "ipfs://example.png"
  let type_key: Data = "media_type"
  let type_val: Data = "image/png"
  let author_key: Data = types.author
  let author_val: Data = issuer

  let metadata_items: Pairs<Data, Data> =
    [
      Pair(name_key, name_val), Pair(image_key, image_val),
      Pair(type_key, type_val), Pair(author_key, author_val),
    ]

  let metadata = CIP68 { metadata: metadata_items, version: 1 }

  let datum: Data = metadata

  let tx: Transaction =
    mocktail_tx()
      |> mint(True, -1, policy_id, cip68_100(asset_name))
      |> mint(True, -1, policy_id, cip68_222(asset_name))
      |> tx_out(True, issuer_address, from_lovelace(4_000_000))
      |> tx_out(True, platform_address, from_lovelace(platform_fee + 1_500_000))
      |> required_signer_hash(True, issuer)
      |> complete()
      |> add_input(
          True,
          Input {
            output_reference,
            output: mock_script_output(
              store_address,
              from_asset(policy_id, cip68_100(asset_name), 1)
                |> add("", "", 2_000_000),
              InlineDatum(Some(datum)),
            ),
          },
        )
      |> add_input(
          True,
          Input {
            output_reference,
            output: mock_output(
              issuer_address,
              from_asset(policy_id, cip68_222(asset_name), 1)
                |> add("", "", 2_000_000),
              NoDatum,
              None,
            ),
          },
        )

  mint_validator.mint.mint(
    platform_fee,
    issuer,
    platform,
    store_payment_cred,
    store_stake_cred,
    redeemer,
    policy_id,
    tx,
  )
}

test burn_fail_no_fee() {
  let redeemer: MintRedeemer = Burn
  let platform_fee: Int = 2_000_000
  let policy_id: PolicyId = mock_policy_id(0)
  let asset_name: ByteArray = "Aiken Course 2025"
  let issuer: VerificationKeyHash = mock_pub_key_hash(0)
  let platform: VerificationKeyHash = mock_pub_key_hash(1)
  let store_payment_cred: ScriptHash = mock_script_hash(2)
  let store_stake_cred: VerificationKeyHash = mock_pub_key_hash(3)
  let platform_address = address.from_verification_key(platform)
  let issuer_address = address.from_verification_key(issuer)
  let output_reference = mock_utxo_ref(0, 1)

  let store_address =
    address.from_script(store_payment_cred)
      |> address.with_delegation_key(store_stake_cred)

  let name_key: Data = "name"
  let name_val: Data = "Aiken Course 2025"
  let image_key: Data = "image"
  let image_val: Data = "ipfs://example.png"
  let type_key: Data = "media_type"
  let type_val: Data = "image/png"
  let author_key: Data = types.author
  let author_val: Data = issuer

  let metadata_items: Pairs<Data, Data> =
    [
      Pair(name_key, name_val), Pair(image_key, image_val),
      Pair(type_key, type_val), Pair(author_key, author_val),
    ]

  let metadata = CIP68 { metadata: metadata_items, version: 1 }

  let datum: Data = metadata

  let tx: Transaction =
    mocktail_tx()
      |> mint(True, -1, policy_id, cip68_100(asset_name))
      |> mint(True, -1, policy_id, cip68_222(asset_name))
      |> tx_out(True, issuer_address, from_lovelace(4_000_000))
      |> tx_out(True, platform_address, from_lovelace(platform_fee + 1_500_000))
      |> required_signer_hash(True, issuer)
      |> complete()
      |> add_input(
          True,
          Input {
            output_reference,
            output: mock_script_output(
              store_address,
              from_asset(policy_id, cip68_100(asset_name), 1)
                |> add("", "", 2_000_000),
              InlineDatum(Some(datum)),
            ),
          },
        )
      |> add_input(
          True,
          Input {
            output_reference,
            output: mock_output(
              issuer_address,
              from_asset(policy_id, cip68_222(asset_name), 1)
                |> add("", "", 2_000_000),
              NoDatum,
              None,
            ),
          },
        )

  !mint_validator.mint.mint(
    platform_fee,
    issuer,
    platform,
    store_payment_cred,
    store_stake_cred,
    redeemer,
    policy_id,
    tx,
  )
}

test burn_fail_unauthorized() {
  let redeemer: MintRedeemer = Burn
  let platform_fee: Int = 2_000_000
  let policy_id: PolicyId = mock_policy_id(0)
  let asset_name: ByteArray = "Aiken Course 2025"
  let issuer: VerificationKeyHash = mock_pub_key_hash(0)
  let platform: VerificationKeyHash = mock_pub_key_hash(1)
  let store_payment_cred: ScriptHash = mock_script_hash(2)
  let store_stake_cred: VerificationKeyHash = mock_pub_key_hash(3)
  let platform_address = address.from_verification_key(platform)
  let issuer_address = address.from_verification_key(issuer)
  let output_reference = mock_utxo_ref(0, 1)

  let store_address =
    address.from_script(store_payment_cred)
      |> address.with_delegation_key(store_stake_cred)

  let name_key: Data = "name"
  let name_val: Data = "Aiken Course 2025"
  let image_key: Data = "image"
  let image_val: Data = "ipfs://example.png"
  let type_key: Data = "media_type"
  let type_val: Data = "image/png"
  let author_key: Data = types.author
  let author_val: Data = issuer

  let metadata_items: Pairs<Data, Data> =
    [
      Pair(name_key, name_val), Pair(image_key, image_val),
      Pair(type_key, type_val), Pair(author_key, author_val),
    ]

  let metadata = CIP68 { metadata: metadata_items, version: 1 }

  let datum: Data = metadata

  let tx: Transaction =
    mocktail_tx()
      |> mint(True, -1, policy_id, cip68_100(asset_name))
      |> mint(True, -1, policy_id, cip68_222(asset_name))
      |> tx_out(True, issuer_address, from_lovelace(4_000_000))
      |> tx_out(True, platform_address, from_lovelace(platform_fee + 1_500_000))
      |> required_signer_hash(True, issuer)
      |> complete()
      |> add_input(
          True,
          Input {
            output_reference,
            output: mock_script_output(
              store_address,
              from_asset(policy_id, cip68_100(asset_name), 1)
                |> add("", "", 2_000_000),
              InlineDatum(Some(datum)),
            ),
          },
        )
      |> add_input(
          True,
          Input {
            output_reference,
            output: mock_output(
              issuer_address,
              from_asset(policy_id, cip68_222(asset_name), 1)
                |> add("", "", 2_000_000),
              NoDatum,
              None,
            ),
          },
        )

  !mint_validator.mint.mint(
    platform_fee,
    issuer,
    platform,
    store_payment_cred,
    store_stake_cred,
    redeemer,
    policy_id,
    tx,
  )
}
