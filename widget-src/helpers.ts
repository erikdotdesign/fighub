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

export const getDayName = (timestamp: number) => {
  const date = new Date(timestamp);
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayIndex = date.getDay();
  return dayNames[dayIndex];
};

export const formatDateWithOrdinal = (timestamp: number) => {
  const date = new Date(timestamp);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const day = date.getDate();
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const ordinal = getOrdinalSuffix(day);

  return `${month}, ${day}${ordinal} ${year}`;
};

export const getOrdinalSuffix = (day: number) => {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${hours}:${minutes}:${seconds} ${ampm}`;
};

export const getCommitTheme = (timestamp: number) => {
  const now = new Date(timestamp);
  const hour = now.getHours();

  const isDaytime = hour >= 6 && hour < 18;

  return isDaytime ? "light" : "dark";
};

export const getNodePage = (node: any) => {
  let current = node;
  while (current && current.type !== "PAGE") {
    current = current.parent;
  }
  return current?.type === "PAGE" ? current : null;
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getAffectedPages = async (widgetId: string, ids: string[]) => {
  const allAffectedIdsSet = new Set(ids);
  const allAffectedIds = Array.from(allAffectedIdsSet);

  const pageCounts: Record<string, number> = {};

  for (const id of allAffectedIds) {
    const node = await figma.getNodeByIdAsync(id);
    if (!node) continue;

    const page = getNodePage(node);
    if (page) {
      const pageId = page.id;
      pageCounts[pageId] = (pageCounts[pageId] || 0) + 1;
    }
  }

  const mostAffectedPageId = Object.entries(pageCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const mostAffectedPage = mostAffectedPageId
    ? await figma.getNodeByIdAsync(mostAffectedPageId)
    : null;

  const widgetNode = await figma.getNodeByIdAsync(widgetId);
  const widgetPage = getNodePage(widgetNode);

  return {
    pages: pageCounts,
    mainPage: mostAffectedPage?.type === "PAGE" ? mostAffectedPage.name : widgetPage.name
  };
};