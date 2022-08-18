import React, { ReactNode } from 'react'
import './styles.css'

interface Props {
  children?: ReactNode
  className?: string
}

const Card = ({children, className}: Props) => {
  return (
    <div className={`card-container ${className}`}>{children}</div>
  )
}

export default Card