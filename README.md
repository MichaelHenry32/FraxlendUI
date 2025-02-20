##

This is a partial implementation of proof-of-concept UI for Fraxlend that demonstrates a potential way to keep Fraxlend as user friendly as it currently is, while making the protocol more profitable for both borrowers and lenders by using sfrxUSD as the base asset of the protocol instead of frxUSD. non-sfrxUSD pairs are not expected to work and sfrxUSD pairs are only partially implemented at this time (withdrawals only). In the short-term, I envision these pools to be hidden behind an "advanced UI" toggle and for Fraxlend users to default to a sfrxUSD-based Morpho vault that allows them to deposit and receive the highest earnings.

NOTE: Code quality isn't currently great because this has been rapidly prototyped using AI.

TODO:
  * Integrate Withdraw Functionality.
  * Add loan opening/closing functionality



## Getting Started


```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) 
