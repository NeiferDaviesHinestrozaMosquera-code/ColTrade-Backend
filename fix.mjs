import fs from 'node:fs';
let c = fs.readFileSync('prisma/schema.prisma', 'utf8');
c = c.replace(/@@schema\([^)]+\)/g, '');
c = c.replace(/datasource db \{([^}]+)\}/, 'datasource db {\n  provider = "postgresql"\n  schemas = ["public", "auth"]\n}');
c = c.replace(/^enum (\w+) \{([^}]+)}/gm, (match) => match.replace(/\s*\}$/, '\n  @@schema("public")\n}'));
c = c.replace(/^model (\w+) \{([^}]+)}/gm, (match) => match.replace(/\s*\}$/, '\n  @@schema("public")\n}'));
fs.writeFileSync('prisma/schema.prisma', c);
