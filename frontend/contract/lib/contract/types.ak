// ================================
// Redeemer for the Minting Policy
// ================================
//
// MintRedeemer is used when a transaction
// interacts with the minting policy script.
// The redeemer tells the policy *what action*
// the transaction intends to perform.
//
pub type MintRedeemer {

  // Used when the transaction wants to MINT tokens
  //
  // Typical use cases:
  // - Minting an NFT
  // - Issuing a proposal token
  // - Creating governance or utility tokens
  //
  // The minting policy will usually check:
  // - Who is allowed to mint?
  // - Is the minted amount correct?
  // - Is minting allowed only once?
  //
  Mint

  // Used when the transaction wants to BURN tokens
  //
  // Typical use cases:
  // - Burning a proposal NFT after execution
  // - Destroying state tokens during cleanup
  // - Revoking or retiring tokens
  //
  // Burn logic is often more permissive than mint:
  // - Anyone may be allowed to burn
  // - Or only the token owner / author
  //
  Burn
}

// ================================
// Redeemer for the Store / Spending Validator
// ================================
//
// StoreRedeemer is used when spending a UTxO
// locked at a script address (stateful contract).
//
// It represents the *intended operation* on the state.
//
pub type StoreRedeemer {

  // Update the existing on-chain state
  //
  // Typical use cases:
  // - Adding a new signature to a multisig proposal
  // - Updating metadata
  // - Changing proposal status (Pending → Approved)
  //
  // The validator usually checks:
  // - Are the required signatures present?
  // - Are only allowed fields modified?
  // - Is the state token preserved?
  //
  Update

  // Remove the state from the blockchain
  //
  // Typical use cases:
  // - Executing a treasury withdrawal
  // - Finalizing and closing a proposal
  // - Cleaning up the state UTxO
  //
  // The validator usually checks:
  // - Has the multisig threshold been reached?
  // - Is this action authorized?
  // - Is the state token burned or consumed?
  //
  Remove
}

// ================================
// Constant key for Datum / Metadata access
// ================================
//
// author is a constant ByteArray used
// as a standardized key when accessing
// maps or metadata inside a datum.
//
pub const author: ByteArray = "author"
