// components/ResumePDF.jsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { marked } from "marked";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 6,
  },
});

function parseMarkdownToTextBlocks(markdown = "") {
  const tokens = marked.lexer(markdown);
  const blocks = [];

  tokens.forEach((token, idx) => {
    if (token.type === "heading") {
      blocks.push(
        <Text key={idx} style={[styles.heading, { fontSize: 14 + (6 - token.depth) }]}>
          {token.text}
        </Text>
      );
    } else if (token.type === "paragraph") {
      blocks.push(
        <Text key={idx} style={styles.paragraph}>
          {token.text}
        </Text>
      );
    } else if (token.type === "list") {
      token.items.forEach((item, i) => {
        blocks.push(
          <Text key={`${idx}-item-${i}`} style={styles.paragraph}>
            • {item.text}
          </Text>
        );
      });
    }
  });

  return blocks;
}

export default function ResumePDF({ markdown }) {
  const blocks = parseMarkdownToTextBlocks(markdown || "");

  return (
    <Document>
      <Page style={styles.page}>
        <View>{blocks}</View>
      </Page>
    </Document>
  );
}
