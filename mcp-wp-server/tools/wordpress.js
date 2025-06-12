import fetch from "node-fetch";

export const wp_post = async ({ title, content, image_url, filename }) => {
  const url = process.env.WP_URL;
  const user = process.env.WP_USER;
  const pass = process.env.WP_APP_PASSWORD;
  const auth = Buffer.from(`${user}:${pass}`).toString("base64");

  const mediaRes = await fetch(`${url}/wp-json/wp/v2/media`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "image/jpeg"
    },
    body: await fetch(image_url).then(r => r.buffer())
  });

  const media = await mediaRes.json();

  const postRes = await fetch(`${url}/wp-json/wp/v2/posts`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title,
      content,
      status: "publish",
      featured_media: media.id
    })
  });

  return await postRes.json();
};
