import { Application, extensions, ExtensionType } from "pixi.js";
import { Action, Chat, CustomEventMap, Boredom, KeysListener, loadBackground, Singletons, Yennefer } from "@app";
import { loadHall } from "@widgets";

declare global {
  interface WindowEventMap extends CustomEventMap { }
  interface Window extends Singletons { }
}

extensions.add({
  extension: {
    name: 'loadTxt',
    type: ExtensionType.LoadParser
  },
  test(url: string) {
    // Проверяем, заканчивается ли адрес файла на .csv
    return url.endsWith('.csv');
  },
  async load(url: string) {
    // Просто скачиваем файл как текст
    const response = await fetch(url);
    return await response.text();
  }
});

(async () => {
  const app = new Application();
  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#000000",
    antialias: true,
    roundPixels: true
  });
  document.body.appendChild(app.canvas);

  window.KeysListener = new KeysListener();
  window.Boredom = new Boredom();
  window.Yennefer = new Yennefer();
  window.Action = new Action();
  window.Chat = new Chat();

  await window.Yennefer.load();
  await window.Boredom.load();
  await window.Action.load();
  await window.Chat.load();

  const background = await loadBackground({ width: window.innerWidth, height: window.innerHeight, file: "assets/hall/hall.background.png" });
  const hall = await loadHall();

  app.stage.addChild(background);
  app.stage.addChild(hall);
  app.stage.addChild(window.Action.container);
  app.stage.addChild(window.Boredom.container);
  app.stage.addChild(window.Chat.container);
})();
