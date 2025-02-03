# MelodyCoin (MLD) Smart Contract Documentation

MelodyCoin is an advanced ERC20-compatible token implementation with built-in tokenomics features including automated burning, reserve allocation, and a faucet system for new users.

## Core Features

- Automated burn mechanism
- Reserve allocation system
- Built-in faucet for new users
- Front-running protection
- Emergency pause functionality
- Maximum supply cap

## Token Mechanics

### Basic Information

- Name: MelodyCoin
- Symbol: MLD
- Decimals: Configurable (set during deployment)
- Maximum Supply: Configurable (set during deployment)

### Burn Rules

The contract implements an automatic burn mechanism that activates on every transfer:

- Burn Rate: 0.2% (2/1000) of each transfer
- Burn Process:
  - Calculated during each transfer operation
  - Permanently removes tokens from total supply
  - Helps maintain token scarcity and value

### Reserve System

A portion of various operations is allocated to the contract's reserve:

- Reserve Rate: 20% (2/10) of each transfer
- Reserve Allocation:
  - Automatically collected during mints
  - Stored in the contract's balance
  - Used to support faucet functionality

### Faucet Functionality

Built-in faucet system to distribute tokens to new users:

- Distribution Amount: 0.1 MLD (1e17 wei)
- Eligibility Rules:
  - User balance must be below 1.5 MLD
  - 24-hour cooldown between requests
  - Contract must have sufficient reserve balance

### Mint Rules

Token minting is controlled with several safety mechanisms:

- Owner-only access
- Maximum cap enforcement
- Reserve allocation:
  - 20% of minted tokens go to reserve
  - 80% to specified recipient
- Contract must not be paused

## Security Features

### Front-Running Protection

Implements protection against approval front-running:

- Requires setting allowance to zero before increasing
- Prevents common attack vectors in token approvals

### Pause Mechanism

Emergency pause functionality:

- Owner can pause/unpause all transfer operations
- Affects transfers, approvals, and minting
- Emits events for transparency

### Other Security Measures

- Zero address transfer prevention
- Overflow protection using Solidity 0.8.10
- Balance and allowance checks
- Proper access control modifiers

## Events

The contract emits standard and custom events:

- Transfer (standard ERC20)
- Approval (standard ERC20)
- Burn (custom)
- Mint (custom)
- Paused/UnPaused (custom)

## Error Handling

Custom error messages for better gas efficiency and clarity:

- InvalidAddress
- NotAnOwner
- InsufficientFunds
- TooHighBalance
- TooFrequentRequests
- DepletedFaucetReserves
- ContractPaused
- MaxCapExceeded
- InsufficientAllowance
- FrontRunApprovalCheck

## Administrative Functions

### Owner Controls

- Minting new tokens (within max cap)
- Pausing/unpausing contract
- Initial configuration during deployment

## Technical Specifications

### Modifiers

- onlyOwner
- isContractPaused
- noZeroAddrTransfer
- hasSufficientFunds
- faucetMaxBalanceCheck
- faucetDayIntervalCheck
- faucetBalanceCheck
- maxCapCheck
- hasSufficientAllowance
- checkApprovalRace

### Constants

- RESERVE_PERCENTAGE: 2 (0.2%)
- BURN_PERCENTAGE: 2 (0.2%)
- PERCENTAGE_FACTOR: 1000
- FAUCET_ONE_TIME_DELIVERY_AMOUNT: 0.1 tokens
- FAUCET_USER_THRESHOLD_BALANCE: 1.5 tokens
- FAUCET_VALIDATION_INTERVAL: 24 hours

## License

This contract is licensed under the MIT License.

## Version

Implemented in Solidity version 0.8.10
