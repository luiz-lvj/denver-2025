/**
 * Configuration class for Ethereum integration.
 */
export class EthereumConfig {
  private static instance: EthereumConfig | null = null;
  private readonly privateKey: string;

  /**
   * Creates a new EthereumConfig instance.
   */
  private constructor() {
    // Get the private key from environment variable
    const privateKey = process.env.ETHEREUM_PRIVATE_KEY;
    
    if (!privateKey) {
      throw new Error(
        "Ethereum private key not found. Please set ETHEREUM_PRIVATE_KEY environment variable.",
      );
    }
    
    this.privateKey = privateKey;
  }

  /**
   * Gets the singleton instance of EthereumConfig.
   *
   * @returns The EthereumConfig instance
   */
  public static getInstance(): EthereumConfig {
    if (!EthereumConfig.instance) {
      EthereumConfig.instance = new EthereumConfig();
    }
    return EthereumConfig.instance;
  }

  /**
   * Resets the singleton instance of EthereumConfig.
   */
  public static resetInstance(): void {
    EthereumConfig.instance = null;
  }

  /**
   * Gets the Ethereum private key.
   *
   * @returns The Ethereum private key string
   */
  public getPrivateKey(): string {
    if (!this.privateKey) {
      throw new Error(
        "Ethereum private key not found. Please set ETHEREUM_PRIVATE_KEY environment variable.",
      );
    }
    return this.privateKey;
  }
} 