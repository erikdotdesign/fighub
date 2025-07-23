export const mergeUnique = (existing: string[], incoming: string[]) => {
  const set = new Set([...existing, ...incoming]);
  return Array.from(set);
};

export const getIpData = async () => {
  try {
    const res = await fetch("https://ipapi.co/json");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("IP lookup failed", err);
    return null;
  }
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
};

export const getCommitTheme = (commitDate: number) => {
  const now = new Date(commitDate);
  const hour = now.getHours();

  const isDaytime = hour >= 6 && hour < 18;

  return isDaytime ? "light" : "dark";
}

export const getNodePage = (node: any) => {
  let current = node;
  while (current && current.type !== "PAGE") {
    current = current.parent;
  }
  return current?.type === "PAGE" ? current : null;
}