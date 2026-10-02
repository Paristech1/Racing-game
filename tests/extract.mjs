import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export function readRepoFile(relPath) {
  return readFileSync(join(root, relPath), 'utf8');
}

/** Extract a `function name(...) { ... }` body (including braces) from source text. */
export function extractFunctionSource(source, name) {
  const re = new RegExp(`function\\s+${name}\\s*\\([^)]*\\)\\s*\\{`, 'm');
  const m = re.exec(source);
  if (!m) return null;
  let i = m.index + m[0].length;
  let depth = 1;
  while (i < source.length && depth > 0) {
    const ch = source[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    i++;
  }
  return source.slice(m.index, i);
}

/** Extract `export function name` from an ES module. */
export function extractExportedFunctionSource(source, name) {
  const re = new RegExp(`export\\s+function\\s+${name}\\s*\\([^)]*\\)\\s*\\{`, 'm');
  const m = re.exec(source);
  if (!m) return null;
  let i = m.index + m[0].length;
  let depth = 1;
  while (i < source.length && depth > 0) {
    const ch = source[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    i++;
  }
  return source.slice(m.index, i);
}

export function stripForCompare(src) {
  if (!src) return '';
  return src
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, '')
    .replace(/THREE\.Vector3/g, 'Vec3')
    .replace(/SAVE\[/g, 'save[')
    .replace(/exportfunction/g, 'function')
    .replace(/,det=/g, ';constdet=')
    .replace(/(\d),([a-z]+)=/g, '$1;const$2=')
    .replace(/\),([a-z]+)=/g, ');const$1=')
    .replace(/,([A-Za-z][A-Za-z0-9]*)=/g, ';const$1=')
    .replace(/\(s\/L\)\*N/g, 's/L*N')
    .replace(/return(?:\(0)?\.5\*\(/g, 'return(0.5*(')
    .replace(/\)\);\}/g, ');}')
    .replace(/([><=!*])0\./g, '$1.')
    .replace(/rivalChassisEligible\(c,rivalBoss\)/g, 'rivalChassisEligible(c)')
    .replace(/cars\.find\(c=>rivalChassisEligible\(c(?:,rivalBoss)?\)\)/g, 'cars.find(rivalChassisEligible)');
}

export function stripFunctionBody(src) {
  const s = stripForCompare(src);
  const open = s.indexOf('{');
  const close = s.lastIndexOf('}');
  if (open < 0 || close < 0) return s;
  return s.slice(open + 1, close);
}

/** Parse `NAME = [[z, y], ...]` loft key tables from a Blender car script. */
export function extractPyLoftTable(source, name) {
  const re = new RegExp(`(?:^|\\n)${name}\\s*=\\s*\\[`, 'm');
  const m = re.exec(source);
  if (!m) return null;
  let i = m.index + m[0].length - 1;
  let depth = 0;
  const start = i;
  while (i < source.length) {
    const ch = source[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
    i++;
  }
  let raw = source.slice(start, i);
  raw = raw.replace(/#.*$/gm, '');
  raw = raw.replace(/,\s*]/g, ']');
  raw = raw.replace(/-\.(\d)/g, '-0.$1');
  raw = raw.replace(/([,\[\s])\.(\d)/g, '$10.$2');
  return JSON.parse(raw);
}

/** Parse `const NAME=[[z,y],...]` inside a GLB shell function (vinyl side-section keys). */
export function extractJsLoftConst(source, fnName, constName) {
  const fn = extractFunctionSource(source, fnName);
  const fnMark = `function ${fnName}`;
  const fnIdx = source.indexOf(fnMark);
  const beforeFn = fnIdx >= 0 ? source.slice(Math.max(0, fnIdx - 6000), fnIdx) : '';
  for (const scope of [fn, beforeFn]) {
    if (!scope) continue;
    const re = new RegExp(`(?:const\\s+|[,\\n]\\s*)${constName}\\s*=\\s*\\[`, 'm');
    const m = re.exec(scope);
    if (!m) continue;
    let i = m.index + m[0].length - 1;
    let depth = 0;
    const start = i;
    while (i < scope.length) {
      const ch = scope[i];
      if (ch === '[') depth++;
      else if (ch === ']') {
        depth--;
        if (depth === 0) {
          i++;
          break;
        }
      }
      i++;
    }
    let raw = scope.slice(start, i);
    raw = raw.replace(/,\s*]/g, ']');
    raw = raw.replace(/-\.(\d)/g, '-0.$1');
    raw = raw.replace(/([,\[\s])\.(\d)/g, '$10.$2');
    return JSON.parse(raw);
  }
  return null;
}

export function bossIdListsInSource(source) {
  const lists = [];
  const re = /\[(['"])(overload|volcano|zephyr|hikari)\1(?:\s*,\s*['"](?:overload|volcano|zephyr|hikari)['"]){3}\]/g;
  let m;
  while ((m = re.exec(source))) lists.push(m[0]);
  const inline =
    /c\.id==='overload'\|\|c\.id==='volcano'\|\|c\.id==='zephyr'\|\|c\.id==='hikari'/g;
  if (inline.test(source)) lists.push("['overload','volcano','zephyr','hikari']");
  return lists;
}
