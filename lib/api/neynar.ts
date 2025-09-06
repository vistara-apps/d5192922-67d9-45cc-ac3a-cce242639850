// Neynar API integration for Farcaster data
import axios from 'axios';

const NEYNAR_API_BASE = 'https://api.neynar.com/v2';

export class NeynarAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      'accept': 'application/json',
      'api_key': this.apiKey,
    };
  }

  // Get user profile by FID
  async getUserByFid(fid: number) {
    try {
      const response = await axios.get(
        `${NEYNAR_API_BASE}/user/bulk?fids=${fid}`,
        { headers: this.getHeaders() }
      );
      return response.data.users[0];
    } catch (error) {
      console.error('Error fetching user by FID:', error);
      throw error;
    }
  }

  // Get user's recent casts
  async getUserCasts(fid: number, limit = 25) {
    try {
      const response = await axios.get(
        `${NEYNAR_API_BASE}/user/casts?fid=${fid}&limit=${limit}`,
        { headers: this.getHeaders() }
      );
      return response.data.casts;
    } catch (error) {
      console.error('Error fetching user casts:', error);
      throw error;
    }
  }

  // Get user's channels
  async getUserChannels(fid: number) {
    try {
      const response = await axios.get(
        `${NEYNAR_API_BASE}/user/channels?fid=${fid}`,
        { headers: this.getHeaders() }
      );
      return response.data.channels;
    } catch (error) {
      console.error('Error fetching user channels:', error);
      throw error;
    }
  }

  // Search users by username
  async searchUsers(query: string, limit = 10) {
    try {
      const response = await axios.get(
        `${NEYNAR_API_BASE}/user/search?q=${encodeURIComponent(query)}&limit=${limit}`,
        { headers: this.getHeaders() }
      );
      return response.data.result.users;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // Get cast by hash
  async getCast(hash: string) {
    try {
      const response = await axios.get(
        `${NEYNAR_API_BASE}/cast?identifier=${hash}&type=hash`,
        { headers: this.getHeaders() }
      );
      return response.data.cast;
    } catch (error) {
      console.error('Error fetching cast:', error);
      throw error;
    }
  }

  // Post a cast (requires signer)
  async postCast(signerUuid: string, text: string, embeds?: any[]) {
    try {
      const response = await axios.post(
        `${NEYNAR_API_BASE}/cast`,
        {
          signer_uuid: signerUuid,
          text,
          embeds: embeds || [],
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error posting cast:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const neynarAPI = new NeynarAPI(
  process.env.NEXT_PUBLIC_NEYNAR_API_KEY || ''
);
