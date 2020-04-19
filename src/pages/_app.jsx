import '../styles/tailwind.css';

export default ({ Component, pageProps }) => (
  <>
    <Component {...pageProps} />
    <style jsx global>
    {
      `
        .icon-primary { fill: #A5B3BB; }
        .icon-secondary { fill: #0D2B3E; }
      `
    }
    </style>
  </>
)
