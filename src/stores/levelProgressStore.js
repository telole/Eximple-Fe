import { create } from 'zustand';
import { sanitizeText } from '../utils/textFilter';

const useLevelProgressStore = create((set, get) => ({
  currentBodyIndex: 0,
  canContinue: true,
  timeRemaining: 0,
  timerInterval: null,

  // Split materials/description into separate bodies
  getBodies: (level, materials) => {
    const bodies = [];
    
    // Add introduction/description as first body
    if (level?.description) {
      bodies.push({
        type: 'introduction',
        content: sanitizeText(level.description),
        title: sanitizeText(level.title || ''),
      });
    }
    
    // Add materials as separate bodies
    if (materials && Array.isArray(materials)) {
      materials.forEach((material, index) => {
        let contentBody = '';
        let contentType = 'text';
        let resourceUrl = null;
        
        if (material.content && typeof material.content === 'object') {
          contentBody = material.content.body || '';
          contentType = material.content.type || 'text';
          if (material.content.type === 'video') {
            resourceUrl = material.content.body;
            contentBody = '';
          }
        } else if (typeof material.content === 'string') {
          contentBody = material.content;
          contentType = material.content_type || 'text';
        } else {
          const possibleContent = material.body || material.content || material.text || '';
          contentBody = typeof possibleContent === 'string' ? possibleContent : '';
          contentType = material.content_type || material.type || 'text';
        }
        
        // Ensure contentBody is always a string, never an object
        if (typeof contentBody !== 'string') {
          if (typeof contentBody === 'object' && contentBody !== null) {
            contentBody = contentBody.body || contentBody.content || JSON.stringify(contentBody);
          } else {
            contentBody = String(contentBody || '');
          }
        }
        
        // Filter UTF-16 characters from content
        contentBody = sanitizeText(contentBody);
        
        bodies.push({
          type: 'material',
          id: material.id || index,
          content: contentBody,
          content_type: contentType,
          resource_url: resourceUrl || material.resource_url,
          resources: material.content?.resources || material.resources,
          index,
        });
      });
    }
    
    return bodies;
  },

  // Reset level progress
  resetLevel: () => {
    if (get().timerInterval) {
      clearInterval(get().timerInterval);
    }
    set({
      currentBodyIndex: 0,
      canContinue: true,
      timeRemaining: 0,
      timerInterval: null,
    });
  },

  nextBody: () => {
    set({ currentBodyIndex: get().currentBodyIndex + 1, canContinue: false });
    get().startTimer();
  },

  startTimer: () => {
    if (get().timerInterval) {
      clearInterval(get().timerInterval);
    }
    
    set({ timeRemaining: 10 });
    
    const interval = setInterval(() => {
      const remaining = get().timeRemaining;
      if (remaining <= 1) {
        clearInterval(interval);
        set({ 
          canContinue: true, 
          timeRemaining: 0,
          timerInterval: null,
        });
      } else {
        set({ timeRemaining: remaining - 1 });
      }
    }, 1000);
    
    set({ timerInterval: interval });
  },

  checkCanContinue: () => {
    return get().canContinue;
  },
}));

export default useLevelProgressStore;

