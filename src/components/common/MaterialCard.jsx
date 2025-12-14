import { sanitizeText, sanitizeHTML } from '../../utils/textFilter';

function MaterialCard({ material, index }) {
  if (!material || !material.content) return null;

  const { type, body, resources } = material.content;

  const renderContent = () => {
    switch (type) {
      case 'html':
        return (
          <div 
            className="html-content"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(body || '') }}
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          />
        );
      case 'text':
        return (
          <p className="text-white/90 font-['ZT_Nature'] text-lg whitespace-pre-line">
            {sanitizeText(body || '')}
          </p>
        );
      case 'video':
        return (
          <div className="w-full">
            <video 
              src={sanitizeText(body || '')} 
              controls 
              className="w-full rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      default:
        return (
          <p className="text-white/90 font-['ZT_Nature'] text-lg">
            {sanitizeText(body || '')}
          </p>
        );
    }
  };

  return (
    <div className="bg-white/5 rounded-2xl border-2 border-white/10 p-6 mb-6">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-gradient-to-b from-[#168318] to-[#1fb622] rounded-lg text-white font-['ZT_Nature'] text-sm font-medium">
          Material {index + 1}
        </span>
      </div>
      
      <div className="material-content">
        <style>{`
          .html-content h2 {
            font-family: 'ZT_Nature', sans-serif;
            font-size: 1.5rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.95);
            margin-top: 1.5rem;
            margin-bottom: 1rem;
          }
          .html-content h2:first-child {
            margin-top: 0;
          }
          .html-content h3 {
            font-family: 'ZT_Nature', sans-serif;
            font-size: 1.25rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
            margin-top: 1.25rem;
            margin-bottom: 0.75rem;
          }
          .html-content p {
            font-family: 'ZT_Nature', sans-serif;
            font-size: 1rem;
            line-height: 1.6;
            color: rgba(255, 255, 255, 0.85);
            margin-bottom: 1rem;
          }
          .html-content strong {
            font-weight: 600;
            color: rgba(255, 255, 255, 0.95);
          }
          .html-content ul, .html-content ol {
            margin-left: 1.5rem;
            margin-bottom: 1rem;
            color: rgba(255, 255, 255, 0.85);
          }
          .html-content li {
            margin-bottom: 0.5rem;
            font-family: 'ZT_Nature', sans-serif;
          }
          .html-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1rem 0;
          }
        `}</style>
        {renderContent()}
      </div>

      {resources && resources.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h4 className="font-['ZT_Nature'] text-lg text-white/80 mb-2">Resources:</h4>
          <div className="grid grid-cols-2 gap-4">
            {resources.map((resource, idx) => (
              <div key={idx} className="bg-white/5 rounded-lg p-2">
                {resource.type === 'image' && (
                  <img 
                    src={resource.url} 
                    alt={resource.alt || `Resource ${idx + 1}`}
                    className="w-full h-auto rounded"
                  />
                )}
                {resource.type === 'video' && (
                  <video 
                    src={resource.url} 
                    controls 
                    className="w-full rounded"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                {resource.title && (
                  <p className="text-white/70 font-['ZT_Nature'] text-sm mt-2">
                    {resource.title}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MaterialCard;

