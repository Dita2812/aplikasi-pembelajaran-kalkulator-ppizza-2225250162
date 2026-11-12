// Ilustrasi pizza 3D memakai three.js (dimuat dari CDN lewat import map di index.html).
// Ukuran pizza mengikuti diameter (cm), dengan skala yang sama untuk semua pizza.
// Kalau three.js gagal dimuat (offline) atau WebGL tidak ada, aplikasi tetap jalan tanpa 3D.

const MAX_D = 50; // diameter terbesar (cm) = jari-jari model 5 satuan
const FALLBACK = '<p class="muted pad">Tampilan 3D tidak tersedia di perangkat ini. Angka di bawah tetap berfungsi.</p>';

function makePizza(THREE) {
  const g = new THREE.Group();
  const crust = new THREE.Mesh(
    new THREE.CylinderGeometry(5, 5, 0.6, 56),
    new THREE.MeshStandardMaterial({ color: 0xc98a3f, roughness: 0.8 })
  );
  const cheese = new THREE.Mesh(
    new THREE.CylinderGeometry(4.45, 4.45, 0.72, 56),
    new THREE.MeshStandardMaterial({ color: 0xf2c14e, roughness: 0.6 })
  );
  g.add(crust, cheese);
  const pepperoni = new THREE.MeshStandardMaterial({ color: 0xb5301f, roughness: 0.7 });
  [
    [-1.6, -1.8], [1.7, -1.2], [-0.2, 0.5], [-2.7, 1.3], [2.4, 1.9], [0.4, -3.0], [-3.1, -0.4],
  ].forEach(([x, z]) => {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.2, 24), pepperoni);
    p.position.set(x, 0.45, z);
    g.add(p);
  });
  return g;
}

function build(THREE, container, count) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  container.appendChild(renderer.domElement);
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';

  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 0.85));
  const sun = new THREE.DirectionalLight(0xffffff, 1.5);
  sun.position.set(6, 12, 8);
  scene.add(sun);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  if (count === 1) camera.position.set(0, 8.5, 11.5);
  else camera.position.set(0, 11, 17);
  camera.lookAt(0, 0, 0);

  const pizzas = [];
  for (let i = 0; i < count; i++) {
    const group = makePizza(THREE);
    group.position.x = count === 1 ? 0 : i === 0 ? -5.7 : 5.7;
    group.rotation.y = i * 1.3;
    scene.add(group);
    pizzas.push({ group, current: 0.5, target: 0.5 });
  }

  function resize() {
    const w = container.clientWidth || 320;
    const h = container.clientHeight || 220;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(container);

  let raf = 0;
  let alive = true;
  function frame() {
    if (!alive) return;
    pizzas.forEach((p) => {
      p.current += (p.target - p.current) * 0.14;
      p.group.scale.set(p.current, 1, p.current);
      if (!reduceMotion) p.group.rotation.y += 0.006;
    });
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  frame();

  return {
    setDiameters(ds) {
      ds.forEach((d, i) => {
        if (pizzas[i]) pizzas[i].target = Math.max(0.1, d / MAX_D);
      });
    },
    dispose() {
      alive = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

export function createPizzaScene(container, { count = 1 } = {}) {
  let inner = null;
  let disposed = false;
  let lastSizes = [];

  import('three')
    .then((THREE) => {
      if (disposed) return;
      inner = build(THREE, container, count);
      inner.setDiameters(lastSizes);
    })
    .catch(() => {
      if (!disposed) container.innerHTML = FALLBACK;
    });

  return {
    setDiameters(...ds) {
      lastSizes = ds;
      inner?.setDiameters(ds);
    },
    dispose() {
      disposed = true;
      inner?.dispose();
    },
  };
}
