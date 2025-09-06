# PeerLink - Connect, Learn, and Earn with Your Peers

A web3-native platform for students to exchange academic help, practical skills, and study resources through peer-to-peer interactions on Base.

## Features

### 🎓 On-Demand Peer Tutoring
- Quick access to peer tutors for immediate academic help
- Live tutoring sessions with secure USDC payments
- Subject-specific matching and scheduling

### 🔄 Skill-Swapping Marketplace
- Offer and discover practical skills from peers
- Interactive workshops and skill transfer sessions
- Tokenized credentials for successful skill transfers

### 📚 Notes & Resource Exchange
- Secure marketplace for study materials
- IPFS storage for decentralized resource hosting
- Peer-curated and rated content

### 👥 Curated Study Groups
- Focused study groups for specific courses
- Collaborative learning environments
- Easy discovery and group formation

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Blockchain**: Base (Ethereum L2)
- **Wallet**: OnchainKit with MiniKit integration
- **Payments**: USDC micro-transactions
- **Storage**: IPFS for decentralized resource storage
- **Identity**: Farcaster integration for social context

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys:
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: Your OnchainKit API key
   - `NEXT_PUBLIC_NEYNAR_API_KEY`: Farcaster/Neynar API key (optional)

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Architecture

### Data Models

- **User**: Farcaster FID-based identity with skills, courses, and reputation
- **TutoringSession**: Peer-to-peer tutoring with on-chain payments
- **Skill**: Offered skills with pricing and exchange options
- **Resource**: Study materials with IPFS storage and pricing
- **StudyGroup**: Collaborative learning groups with member management

### Design System

- **Colors**: Primary blue (#00BFFF), Accent purple (#DA70D6)
- **Typography**: Inter font with semantic sizing
- **Components**: Glass morphism cards, gradient buttons, smooth animations
- **Layout**: Mobile-first responsive design with 12-column grid

### Payment Flow

1. Student requests tutoring/resource
2. Smart contract escrows USDC payment
3. Service is delivered (tutoring session/resource access)
4. Payment is released to provider
5. Platform fee (5%) is deducted

## Development

### Project Structure

```
app/                    # Next.js App Router pages
├── layout.tsx         # Root layout with providers
├── page.tsx           # Homepage with dashboard
├── providers.tsx      # MiniKit and OnchainKit providers
└── globals.css        # Global styles and design tokens

components/
├── ui/                # Reusable UI components
├── layout/            # Layout components (Header, AppShell)
└── features/          # Feature-specific components

lib/
├── types.ts           # TypeScript type definitions
├── utils.ts           # Utility functions
└── constants.ts       # App constants and configuration
```

### Key Components

- **AppShell**: Main layout wrapper with glass morphism
- **ProfileCard**: User profile display with reputation
- **TutoringCard**: Session display with payment integration
- **ResourceCard**: Study material cards with IPFS links
- **StudyGroupCard**: Group information and member management

### Styling

Uses Tailwind CSS with custom design tokens:
- Glass morphism effects for modern UI
- Gradient backgrounds and buttons
- Smooth animations and transitions
- Mobile-first responsive design

## Deployment

The app is optimized for deployment on Vercel or similar platforms:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel deploy
   ```

3. **Set environment variables** in your deployment platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Follow us on Farcaster

---

Built with ❤️ for the Base ecosystem and Farcaster community.
