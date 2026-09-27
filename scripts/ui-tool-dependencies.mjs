/** 输出发布版 UI 预览所需的第三方包，供显式安装到独立工具目录；本脚本不安装依赖。 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { packageRoot } from './dsh-environment.mjs'

if (packageRoot === undefined) throw new Error('DSH_PACKAGE_ROOT is required')
const dependencies = new Map()
for (const name of ['dsh-client-ui-primitives', 'dsh-client-store']) {
  const manifest = JSON.parse(readFileSync(join(packageRoot, 'node_modules', '@deepseek-ai', name, 'package.json'), 'utf8'))
  for (const [dependency, version] of Object.entries(manifest.devDependencies ?? {})) {
    if (/^@deepseek-ai\/|^@types\//.test(dependency) || ['react', 'react-dom'].includes(dependency)) continue
    const existing = dependencies.get(dependency)
    if (existing !== undefined && existing !== version) throw new Error(`Conflicting UI dependency: ${dependency}`)
    dependencies.set(dependency, version)
  }
}
console.log([...dependencies].map(([name, version]) => `${name}@${version}`).sort().join('\n'))
