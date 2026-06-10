import { useMemo } from 'react'
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const TYPE_COLORS = {
  root_cause: '#E24B4A',
  contributing_factor: '#EF9F27',
  effect: '#378ADD'
}

export default function CausalGraph({ chain }) {
  const { nodes, edges } = useMemo(() => {
    const nodes = chain.map((node, i) => ({
      id: node.id,
      position: { x: 200 * i, y: i % 2 === 0 ? 100 : 220 },
      data: {
        label: (
          <div style={{ textAlign: 'center', padding: '4px' }}>
            <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4 }}>
              {node.description.length > 40
                ? node.description.slice(0, 40) + '...'
                : node.description}
            </div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>
              {node.business_metric}
            </div>
            <div style={{
              marginTop: 6,
              fontSize: 11,
              fontWeight: 700,
              color: TYPE_COLORS[node.type]
            }}>
              {Math.round(node.confidence * 100)}% confidence
            </div>
          </div>
        )
      },
      style: {
        background: '#ffffff',
        border: `2px solid ${TYPE_COLORS[node.type] || '#888'}`,
        borderRadius: 10,
        padding: 8,
        width: 180,
        fontSize: 12
      }
    }))

    const edges = chain.slice(0, -1).map((node, i) => ({
      id: `e${i}`,
      source: node.id,
      target: chain[i + 1].id,
      animated: true,
      style: { stroke: '#888', strokeWidth: 1.5 },
      label: 'caused',
      labelStyle: { fontSize: 10 }
    }))

    return { nodes, edges }
  }, [chain])

  if (!chain.length) {
    return (
      <div className="empty-state">
        No causal chain identified for this time range.
      </div>
    )
  }

  return (
    <div style={{ height: 420, border: '0.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background gap={16} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
