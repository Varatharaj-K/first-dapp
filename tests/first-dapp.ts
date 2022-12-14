import * as anchor from "@project-serum/anchor";
import { assert } from "chai";

describe("first-dapp", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local()
  anchor.setProvider(provider)

  const program = anchor.workspace.FirstDapp

  const calculator = anchor.web3.Keypair.generate()


  it("Creates a calculator", async () => {
    await program.rpc.create("Welcome to Solana", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [calculator]
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.greeting === "Welcome to Solana")
  });

  it("Adds two number", async () => {
    await program.rpc.add(new anchor.BN(2), new anchor.BN(3),{
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(5)))
  })

  it("Subtract two number", async () => {
    await program.rpc.sub(new anchor.BN(3), new anchor.BN(1),{
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(2)))
  })

  it("Multiply two number", async () => {
    await program.rpc.mul(new anchor.BN(3), new anchor.BN(1),{
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(3)))
  })


  it("Divide two number", async () => {
    await program.rpc.div(new anchor.BN(5), new anchor.BN(2),{
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(2)))
    assert.ok(account.remainder.eq(new anchor.BN(1)))
  })
});
