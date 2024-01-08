export default [
  {
    _name: "CSidebarNav",
    _children: [
      {
        _name: "CSidebarNavTitle",
        _children: ["Artists"],
      },
      {
        _name: "CSidebarNavItem",
        name: "Artists List",
        to: "/artists",
        icon: "cil-list",
      },
      {
        _name: "CSidebarNavItem",
        name: "Albums",
        to: "/albums",
        icon: "cil-album",
      },
      {
        _name: "CSidebarNavDropdown",
        name: "Links",
        route: "/pages",
        icon: "cil-star",
        items: [
          {
            name: "Moat Builders Developer Task",
            href: "https://gitlab.com/-/snippets/2167416",
            target: "_blank",
          },
        ],
      },
    ],
  },
];
