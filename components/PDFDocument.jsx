export default function PrintableResume({ markdown }) {
  return (
    <html>
      <head>
        <title>Printable Resume</title>
        <style>
          {`
            body {
              font-family: Helvetica, sans-serif;
              padding: 40px;
              color: #000;
              background: white;
              line-height: 1.6;
              max-width: 794px;
              margin: auto;
            }
            h1, h2, h3 {
              color: #0f172a;
            }
            [align="center"] {
              text-align: center;
            }
            a {
              color: #0366d6;
              text-decoration: none;
            }
            ul {
              padding-left: 20px;
            }
          `}
        </style>
      </head>
      <body>
        <div id="print-content">
          <div dangerouslySetInnerHTML={{ __html: markdown }} />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.onload = () => {
                window.print();
              };
            `
          }}
        />
      </body>
    </html>
  );
}
