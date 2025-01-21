import { visit } from 'unist-util-visit'

export function remarkCodeTitle() {
  return (tree, { data }) => {
    const nodesToInsert = []
    visit(tree, 'code', (node, index, parent) => {
      const language = node.lang

      let meta = node.meta

      if (!language) {
        return
      }

      const className = 'remark-code-title'
      let titleNode

      // 只显示语言
      titleNode = {
        type: 'html',
        value: `<div class="${className}">
            <div id="only-lang">${language}</div>
            <div id="separate-line"></div>
          </div>`.trim(),
      }

      if (meta) {
        // 排除掉其他 meta 项
        const metas = meta.split(' ').filter(m => m.includes('file='))

        if (metas.length > 0) {
          meta = metas[0].replace('file=', '')

          // 显示文件名和语言
          titleNode = {
            type: 'html',
            value: `<div class="${className}">
                <div id="filename-with-lang">
                  <div>${meta}</div>
                  <div>${language}</div>
                </div>
                <div id="separate-line">
                </div>
              </div>`.trim(),
          }
          // 保存需要插入的元素
          nodesToInsert.push({ parent, index, titleNode })
        }
      }
    })

    // 插入元素
    for (const { parent, index, titleNode } of nodesToInsert.reverse()) {
      parent.children.splice(index, 0, titleNode)
    }
  }
}