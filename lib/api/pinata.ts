// Pinata IPFS integration for decentralized storage
import axios from 'axios';

const PINATA_API_BASE = 'https://api.pinata.cloud';

export class PinataAPI {
  private apiKey: string;
  private secretKey: string;

  constructor(apiKey: string, secretKey: string) {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
  }

  private getHeaders() {
    return {
      'pinata_api_key': this.apiKey,
      'pinata_secret_api_key': this.secretKey,
    };
  }

  // Upload file to IPFS
  async uploadFile(file: File, metadata?: any) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (metadata) {
        formData.append('pinataMetadata', JSON.stringify({
          name: metadata.name || file.name,
          keyvalues: metadata.keyvalues || {},
        }));
      }

      const response = await axios.post(
        `${PINATA_API_BASE}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            ...this.getHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return {
        hash: response.data.IpfsHash,
        size: response.data.PinSize,
        timestamp: response.data.Timestamp,
      };
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw error;
    }
  }

  // Upload JSON data to IPFS
  async uploadJSON(data: any, metadata?: any) {
    try {
      const response = await axios.post(
        `${PINATA_API_BASE}/pinning/pinJSONToIPFS`,
        {
          pinataContent: data,
          pinataMetadata: metadata || {},
        },
        { headers: this.getHeaders() }
      );

      return {
        hash: response.data.IpfsHash,
        size: response.data.PinSize,
        timestamp: response.data.Timestamp,
      };
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      throw error;
    }
  }

  // Get pinned files list
  async getPinnedFiles(limit = 10, offset = 0) {
    try {
      const response = await axios.get(
        `${PINATA_API_BASE}/data/pinList?pageLimit=${limit}&pageOffset=${offset}`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching pinned files:', error);
      throw error;
    }
  }

  // Unpin file from IPFS
  async unpinFile(hash: string) {
    try {
      const response = await axios.delete(
        `${PINATA_API_BASE}/pinning/unpin/${hash}`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error unpinning file:', error);
      throw error;
    }
  }

  // Get file metadata
  async getFileMetadata(hash: string) {
    try {
      const response = await axios.get(
        `${PINATA_API_BASE}/data/pinList?hashContains=${hash}`,
        { headers: this.getHeaders() }
      );

      return response.data.rows[0];
    } catch (error) {
      console.error('Error fetching file metadata:', error);
      throw error;
    }
  }

  // Generate IPFS gateway URL
  getGatewayUrl(hash: string): string {
    const gatewayUrl = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL || 'https://gateway.pinata.cloud';
    return `${gatewayUrl}/ipfs/${hash}`;
  }

  // Test authentication
  async testAuthentication() {
    try {
      const response = await axios.get(
        `${PINATA_API_BASE}/data/testAuthentication`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error testing authentication:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const pinataAPI = new PinataAPI(
  process.env.PINATA_API_KEY || '',
  process.env.PINATA_SECRET_API_KEY || ''
);
