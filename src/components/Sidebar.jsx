import React, { useEffect, useState } from 'react'
import '../../styles/base.css'
import { TAB_GROUPS } from '../data/tabs.js'

export default function Sidebar({ activeTab, onTabChange, actionItemCount=0, collapsed, onToggleCollapse, onAssistantClick }){

  useEffect(()=>{
    const w = collapsed ? '64px' : '220px'
    document.documentElement.style.setProperty('--sidebar-width', w)
    document.body.classList.add('has-sidebar')
    return ()=>{
      document.body.classList.remove('has-sidebar')
      document.documentElement.style.removeProperty('--sidebar-width')
    }
  },[collapsed])

  useEffect(()=>{
    const onKey = (e)=>{ if(e.key==='b') onToggleCollapse && onToggleCollapse() }
    window.addEventListener('keydown', onKey)
    return ()=>window.removeEventListener('keydown', onKey)
  },[onToggleCollapse])

  return (
    <nav className={`sidebar${collapsed ? ' sidebar--collapsed':''}`} aria-label="Main navigation">
      <div className="sidebar__inner">
        {TAB_GROUPS.map((g,gi)=>(
          <div key={gi} className="sidebar__group">
            {g.label && <div className="sidebar__group-header">{g.label}</div>}
            {g.tabs.map(t=>{
              const isActive = activeTab===t.k
              return (
                <button
                  key={t.k}
                  className={`sidebar__item${isActive ? ' sidebar__item--active':''}`}
                  onClick={()=>onTabChange && onTabChange(t.k)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="sidebar__item-icon" aria-hidden="true">{t.icon}</span>
                  <span className="sidebar__item-label">{t.l}</span>
                  {t.k==='redflags' && actionItemCount>0 && (
                    <span className="sidebar__badge">{actionItemCount}</span>
                  )}
                  {collapsed && (
                    <span className="sidebar__tooltip" role="tooltip">{t.l}</span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <div className="sidebar__bottom">
        <button
          className={`sidebar__ai-btn${actionItemCount>0 ? ' sidebar__ai-btn--pulse':''}`}
          onClick={onAssistantClick}
        >
          ✦ {collapsed ? '' : 'AI Assistant'}
        </button>
        <button
          className="sidebar__toggle"
          onClick={()=>onToggleCollapse && onToggleCollapse()}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '➤' : '◀'}
        </button>
      </div>
    </nav>
  )
}