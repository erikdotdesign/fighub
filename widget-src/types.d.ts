export type Theme = "light" | "dark";

export type CommitDiff = {
  created: number;
  modified: number;
  deleted: number;
}

export type CommitDiffItem = keyof CommitDiff;

export type CommitUser = {
  name: string;
  photo: string;
}

export type CommitLocation = {
  region: string;
  country: string;
  postal: string;
}

export type CommitPages = {
  count: number;
  main: string;
}

export type Commit = {
  id: number;
  timestamp: number;
  theme: Theme;
  user: CommitUser;
  location: CommitLocation;
  message: string;
  pages: CommitPages;
  diff: CommitDiff;
}