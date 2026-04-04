import generalRulebook from "../assets/resources/GRB.pdf";
import Contributer_owner_cordinator from "../assets/resources/InterconnectCOCRB.pdf";
import git_rules from "../assets/resources/git.pdf";

export const PDF_RESOURCES = [
  {
    id: "roles-guide",
    title: "Roles & Responsibilities Guide",
    description:
      "Detailed breakdown of workflows, permissions, and expectations for Contributors, Idea Owners, and Coordinators.",
    fileUrl: Contributer_owner_cordinator, // Update with your actual path
    fileName: "InterConnect-Roles-Guide.pdf",
    color: "#9c3ae8", // Purple
    badge: "Guide",
    tags: [
      { label: "Format", value: "PDF" },
      { label: "Target", value: "All Users" },
      { label: "Must Read", value: "Yes", highlight: true },
    ],
    footerText: "Understand your workflow and how to collaborate effectively.",
  },
  {
    id: "rulebook",
    title: "InterConnect 26.O — Official Rulebook",
    description:
      "The complete official guidelines, judging criteria, submission rules, and code-of-conduct for all participants.",
    fileUrl: generalRulebook, // Update with your actual path
    fileName: "InterConnect-26.O-Rulebook.pdf",
    color: "#e84040", // Red
    badge: "Rulebook",
    tags: [
      { label: "Format", value: "PDF" },
      { label: "Edition", value: "26.O" },
      { label: "Status", value: "Official", highlight: true },
    ],
    footerText:
      "Carefully read all rules before starting your project submission.",
  },
  {
    id: "git-cheatsheet",
    title: "Git & GitHub Command Cheat Sheet",
    description:
      "Quick reference guide for common Git commands, branch management, and resolving merge conflicts during the event.",
    fileUrl: git_rules, // Update with your actual path
    fileName: "Git-Cheat-Sheet.pdf",
    color: "#fbbf24", // Amber
    badge: "Cheat Sheet",
    tags: [
      { label: "Format", value: "PDF" },
      { label: "Topic", value: "Version Control" },
      { label: "Skill", value: "Basic", highlight: false },
    ],
    footerText: "Keep this handy while contributing to repositories.",
  },
];
