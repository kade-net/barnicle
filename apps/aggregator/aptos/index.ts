import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// with custom configuration
const aptosConfig = new AptosConfig({ network: Network.MAINNET });
const aptos = new Aptos(aptosConfig);

export default aptos