import { Client } from "@upstash/qstash";

export const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN,
});

(async () => {
  try {
    await qstashClient.publish({
      url: "https://example.com/notification-test",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: "QStash connected" }),
    });
    console.log(" Upstash connected and test message sent");
  } catch (err) {
    console.error(" Upstash connection error:", err.message);
  }
})();
