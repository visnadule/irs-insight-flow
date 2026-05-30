/**
 * EmbedAutoResize
 *
 * Drop this component anywhere in the app tree. It watches the document height
 * and posts a message to the parent window so WordPress (or any host page) can
 * resize the iframe to match the content.
 *
 * WORDPRESS USAGE — paste this snippet into a Custom HTML block:
 *
 *   <iframe
 *     id="irs-flow-frame"
 *     src="https://your-app.replit.app"
 *     style="width:100%;border:none;min-height:200px;"
 *     scrolling="no"
 *   ></iframe>
 *   <script>
 *     window.addEventListener('message', function(e) {
 *       if (e.data && e.data.type === 'irsFlowHeight') {
 *         document.getElementById('irs-flow-frame').style.height = e.data.height + 'px';
 *       }
 *     });
 *   </script>
 */

import { useEffect } from "react";

export function EmbedAutoResize() {
  useEffect(() => {
    let lastHeight = 0;

    function postHeight() {
      const h = document.documentElement.scrollHeight;
      if (h !== lastHeight) {
        lastHeight = h;
        try {
          window.parent.postMessage({ type: "irsFlowHeight", height: h }, "*");
        } catch {
          // Not inside an iframe — silently ignore
        }
      }
    }

    postHeight();

    const ro = new ResizeObserver(postHeight);
    ro.observe(document.body);

    return () => {
      ro.disconnect();
    };
  }, []);

  return null;
}
