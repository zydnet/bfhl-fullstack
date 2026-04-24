const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/bfhl", (req, res) => {
  const data = req.body.data || [];

  const invalid_entries = [];
  const duplicateSet = new Set();
  const seenStr = new Set();

  const childToParent = new Map();
  const parentToChildren = new Map();
  const nodes = new Set();
  const edges = []; // List of accepted pairs [P, C]

  for (let str of data) {
    if (typeof str !== "string") {
      invalid_entries.push(String(str));
      continue;
    }
    const cleanStr = str.trim();

    if (!/^[A-Z]->[A-Z]$/.test(cleanStr)) {
      invalid_entries.push(cleanStr);
      continue;
    }

    const parent = cleanStr[0];
    const child = cleanStr[3];

    if (parent === child) {
      invalid_entries.push(cleanStr); // Self-loops are invalid
      continue;
    }

    if (seenStr.has(cleanStr)) {
      duplicateSet.add(cleanStr);
      continue;
    }
    seenStr.add(cleanStr);

    if (!childToParent.has(child)) {
      childToParent.set(child, parent);
      
      if (!parentToChildren.has(parent)) {
        parentToChildren.set(parent, []);
      }
      parentToChildren.get(parent).push(child);

      nodes.add(parent);
      nodes.add(child);
      edges.push([parent, child]);
    }
    // Else: dropped edge (child already has a parent)
  }

  // Union-Find to get connected components
  const ufRoot = new Map();
  for (let node of nodes) {
    ufRoot.set(node, node);
  }
  function getUF(n) {
    if (ufRoot.get(n) !== n) {
      ufRoot.set(n, getUF(ufRoot.get(n)));
    }
    return ufRoot.get(n);
  }
  function union(n1, n2) {
    const r1 = getUF(n1);
    const r2 = getUF(n2);
    if (r1 !== r2) {
      ufRoot.set(r1, r2);
    }
  }

  for (let [p, c] of edges) {
    union(p, c);
  }

  const components = new Map();
  for (let node of nodes) {
    const r = getUF(node);
    if (!components.has(r)) components.set(r, []);
    components.get(r).push(node);
  }

  const hierarchies = [];
  let total_trees = 0;
  let total_cycles = 0;
  let largest_tree_root = "";
  let max_depth = 0;

  function buildTree(n) {
    const obj = {};
    const children = parentToChildren.get(n) || [];
    for (let c of children) {
      obj[c] = buildTree(c);
    }
    return obj;
  }

  function getDepth(n) {
    const children = parentToChildren.get(n) || [];
    if (children.length === 0) return 1;
    let maxChildDepth = 0;
    for (let c of children) {
      const d = getDepth(c);
      if (d > maxChildDepth) maxChildDepth = d;
    }
    return 1 + maxChildDepth;
  }

  for (let comp of components.values()) {
    const roots = comp.filter(n => !childToParent.has(n));

    if (roots.length > 0) {
      for (let root of roots) {
        total_trees++;
        const depth = getDepth(root);
        
        hierarchies.push({
          root: root,
          tree: { [root]: buildTree(root) },
          depth: depth
        });

        if (depth > max_depth) {
          max_depth = depth;
          largest_tree_root = root;
        } else if (depth > 0 && depth === max_depth) {
          if (!largest_tree_root || root < largest_tree_root) {
            largest_tree_root = root;
          }
        }
      }
    } else {
      total_cycles++;
      comp.sort();
      const root = comp[0];
      hierarchies.push({
        root: root,
        has_cycle: true,
        tree: {}
      });
    }
  }

  res.json({
    user_id: "DevanshiAgrawal_26072005",
    email_id: "da9592@srmist.edu.in",
    college_roll_number: "RA2311003010075",
    hierarchies,
    invalid_entries,
    duplicate_edges: [...duplicateSet],
    summary: {
      total_trees,
      total_cycles,
      largest_tree_root: largest_tree_root
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));