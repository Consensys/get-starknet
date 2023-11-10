import { MetaMaskAccountWrapper } from "../wallet/metamask_snap/accounts"
import { MetaMaskInpageProvider } from "@metamask/providers"
import { Provider } from "starknet"
import { beforeEach, describe, expect, it, vi } from "vitest"

const starknetProvider = new Provider()

describe("MetaMaskAccountWrapper", () => {
  let metaMaskInjectedProviderMock: MetaMaskInpageProvider
  let metaMaskAccountWrapper: MetaMaskAccountWrapper

  beforeEach(() => {
    metaMaskInjectedProviderMock = {
      request: vi.fn().mockResolvedValue({
        transaction_hash: "0x1234567890ABCDEF1234567890ABCDEF12345678",
      }),
    } as unknown as MetaMaskInpageProvider

    metaMaskAccountWrapper = new MetaMaskAccountWrapper(
      "0x1234567890ABCDEF1234567890ABCDEF12345678",
      starknetProvider,
      "0",
      metaMaskInjectedProviderMock,
      "mySnapId",
    )
  })

  it("should execute a transaction", async () => {
    const result = await metaMaskAccountWrapper.execute([
      {
        contractAddress: "0x1234567890ABCDEF1234567890ABCDEF12345678",
        entrypoint: "myEntrypoint",
        calldata: [],
      },
    ])

    expect(metaMaskInjectedProviderMock.request).toHaveBeenCalledTimes(1)
    expect(metaMaskInjectedProviderMock.request).toHaveBeenCalledWith({
      method: "wallet_invokeSnap",
      params: {
        snapId: "mySnapId",
        request: {
          method: "starkNet_sendTransaction",
          params: {
            chainId: "0x534e5f474f45524c49",
            contractAddress: "0x1234567890ABCDEF1234567890ABCDEF12345678",
            contractCallData: "",
            contractFuncName: "myEntrypoint",
            maxFee: null,
            senderAddress: "0x1234567890ABCDEF1234567890ABCDEF12345678",
          },
        },
      },
    })

    expect(result).toEqual({
      transaction_hash: "0x1234567890ABCDEF1234567890ABCDEF12345678",
    })
  })
})
