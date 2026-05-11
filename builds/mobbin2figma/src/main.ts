import type { UIMessage, SandboxMessage } from './types';

figma.showUI(__html__, { width: 360, height: 560, title: 'Mobbin2Figma' });

figma.ui.onmessage = async (msg: UIMessage) => {
  switch (msg.type) {

    case 'GET_TOKEN': {
      const token = await figma.clientStorage.getAsync('mobbin_token') as string | undefined;
      const reply: SandboxMessage = { type: 'TOKEN_VALUE', token: token ?? null };
      figma.ui.postMessage(reply);
      break;
    }

    case 'SET_TOKEN': {
      await figma.clientStorage.setAsync('mobbin_token', msg.token);
      break;
    }

    case 'PASTE_SCREENS': {
      const created: SceneNode[] = [];
      let failCount = 0;

      for (const screen of msg.screens) {
        try {
          const image = await figma.createImageAsync(screen.url);
          const frame = figma.createFrame();
          frame.name = screen.name;
          frame.resize(390, 844); // iPhone 14 Pro dimensions
          frame.fills = [{ type: 'IMAGE', imageHash: image.hash, scaleMode: 'FIT' }];
          figma.currentPage.appendChild(frame);
          created.push(frame);
        } catch {
          failCount++;
        }
      }

      // Arrange frames in a horizontal row with 40px gap
      let x = 0;
      for (const node of created) {
        node.x = x;
        node.y = 0;
        x += (node as FrameNode).width + 40;
      }

      if (created.length > 0) {
        figma.viewport.scrollAndZoomIntoView(created);
      }

      const reply: SandboxMessage = failCount > 0
        ? { type: 'PASTE_ERROR', message: `${failCount} screen(s) failed to load` }
        : { type: 'PASTE_COMPLETE', count: created.length };

      figma.ui.postMessage(reply);
      break;
    }

    case 'CLOSE_PLUGIN': {
      figma.closePlugin();
      break;
    }
  }
};
