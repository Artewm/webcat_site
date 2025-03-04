import './styles/main.scss';
import * as THREE from 'three'; // Импорт библиотеки Three.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import modelPath from './models/hand.glb';
import modelArrowPath from './models/arrow.glb';

import cases_head from './images/cases_head.png';
import corousel1 from './images/carousel1.png';
import corousel2 from './images/carousel2.png';
import corousel3 from './images/carousel3.png';
import corousel4 from './images/carousel4.png';
import corousel5 from './images/carousel5.png';
import corousel6 from './images/carousel6.png';

import video2_2 from './video/video2_2.mp4';

import beeline from './partners/beeline.png';
import finntrail from './partners/finntrail.png';
import granel from './partners/granel.png';
import ipaksu from './partners/ipaksu.png';
import sber from './partners/sber.png';
import skidex from './partners/skidex.png';
import yandex from './partners/yandex.png';

import worker1 from './worker_cards/worker1.png';
import worker2 from './worker_cards/worker2.png';
import worker3 from './worker_cards/worker3.png';
import worker4 from './worker_cards/worker4.png';
import worker5 from './worker_cards/worker5.png';
import worker6 from './worker_cards/worker6.png';
import worker7 from './worker_cards/worker7.png';
import worker8 from './worker_cards/worker8.png';
import worker9 from './worker_cards/worker9.png';

import nx from './textures/nx.jpg';
import ny from './textures/ny.jpg';
import nz from './textures/nz.jpg';
import px from './textures/px.jpg';
import py from './textures/py.jpg';
import pz from './textures/pz.jpg';
import { rotate } from 'three/tsl';

document.addEventListener("DOMContentLoaded", () => {
    const mediaQuery = window.matchMedia("(min-width: 1200px)");

    if (mediaQuery.matches) {
        initCursorEffect();
        menuInner();
        application();
        logo_anim()
        anim_hand()
    } else {
        initCursorEffect();
        menuInner();
        application();
        logo_anim()
        anim_hand()
    }

    mediaQuery.addEventListener("change", (e) => {
        if (e.matches) {
            initCursorEffect();
            menuInner();
            application();
            logo_anim()
        } else {
            console.log("Разрешение меньше 1200 пикселей")
            initCursorEffect();
            menuInner();
            application();
            logo_anim()
        }
    });

    function anim_hand() {
        const container = document.getElementById('anim_hand'); // Укажите ID вашего блока
    
        // Устанавливаем размеры контейнера
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
    
        // Создание сцены
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#FDFCF9');
    
        // Устанавливаем карту окружения
        const cubeTextureLoader = new THREE.CubeTextureLoader();
        const envMap = cubeTextureLoader.load([
            px, // Путь к положительному X
            nx, // Путь к отрицательному X
            py, // Путь к положительному Y
            ny, // Путь к отрицательному Y
            pz, // Путь к положительному Z
            nz  // Путь к отрицательному Z
        ]);
        
        // Создание камеры
        const camera = new THREE.PerspectiveCamera(50, containerWidth / containerHeight, 0.1, 1000);
        camera.position.set(-0.1, 0, 2);
    
        // Создание рендера
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(containerWidth, containerHeight);
        container.appendChild(renderer.domElement); // Вставляем рендер в указанный контейнер
    
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9); // Направленный свет
        directionalLight.position.set(4, -9, 4.1).normalize();
        scene.add(directionalLight);

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.2);
        hemisphereLight.position.set(4, -9, 4.1).normalize();
        scene.add(hemisphereLight);
    
        // Переменные для хранения 3D-модели
        let model;
    
        // Загрузка GLB-модели
        const loader = new GLTFLoader();
        loader.load(
            modelPath, // Укажите путь к вашей модели
            (gltf) => {
                model = gltf.scene; // Сохраняем сцену модели
    
                model.traverse((child) => {
                    if (child.isMesh && child.material.isMeshStandardMaterial) {
                        child.material.envMap = envMap; // Устанавливаем карту отражений
                        child.material.envMapIntensity = 1.62; // Увеличиваем интенсивность
                        child.material.needsUpdate = true; // Обновляем материал
                    }
                });
    
                scene.add(model.rotateZ(0.4).rotateY(0.5).rotateX(0.1)); // Добавляем модель в сцену
            },
            undefined,
            (error) => {
                console.error('Ошибка при загрузке модели:', error);
            }
        );
    
        // Переменные для отслеживания положения мыши
        const mouse = { x: 0, y: 0 };

        // Ограничения углов
        const maxRotationX = Math.PI / 10; // Предел по оси X (45 градусов)
        const maxRotationY = Math.PI / 15; // Предел по оси Y (0 градусов)

        // Отслеживание положения мыши
        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / containerWidth) * 2 - 1; // Нормализуем координаты
            mouse.y = -(event.clientY / containerHeight) * 2 + 1;
        });

        // Анимация модели
        const animate = () => {
            requestAnimationFrame(animate);

            if (model) {
                // Переводим положение мыши в углы вращения
                const rotationX = THREE.MathUtils.clamp(mouse.y * Math.PI / 9, -maxRotationX, maxRotationX);
                const rotationY = THREE.MathUtils.clamp(-mouse.x * Math.PI / 40, -maxRotationY, maxRotationY);
                
                // Применяем ограниченные углы к модели
                model.rotation.x = rotationX; // Вращение по оси X с ограничением
                model.rotation.y = rotationY; // Вращение по оси Y с ограничением
            }

            renderer.render(scene, camera); // Рендеринг сцены
        };

        animate(); // Запуск анимации
    
        // Обновление размеров рендера при изменении размеров контейнера
        const resizeRenderer = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
    
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
    
        window.addEventListener('resize', resizeRenderer);
    }
    
//liquid effect анимация
let hoverBlock1 = document.querySelectorAll(".hover1");
    let hoverBlock2 = document.querySelectorAll(".hover2");
    let waveLeft = document.querySelector(".wave-left");
    let waveRight = document.querySelector(".wave-right");
    let waveLeft2 = document.querySelector(".wave-left-2");
    let waveRight2 = document.querySelector(".wave-right-2");

    // Проверка на существование всех элементов
    if (!waveLeft || !waveRight || !waveLeft2 || !waveRight2) {
        console.error('Один из элементов wave не найден!');
        return;
    }

    // Обработка всех элементов с классом .hover1
    hoverBlock1.forEach(function (block) {
        block.addEventListener("mouseenter", function () {
            console.log('Мышь наведена на кнопку .hover1');
            waveLeft.style.animation = "wave-left 2s  ";
            waveRight.style.animation = "wave-right 2s ";
            waveLeft.style.backgroundColor = "#1758FF";
            waveRight.style.backgroundColor = "#1758FF";
             // Применяем прозрачный цвет после завершения анимации
             waveLeft.addEventListener("animationend", function handler() {
                waveLeft.style.backgroundColor = "transparent";
                waveLeft.removeEventListener("animationend", handler);
            }, { once: true });
    
                waveRight.addEventListener("animationend", function handler() {
                waveRight.style.backgroundColor = "transparent";
                waveRight.removeEventListener("animationend", handler);
            }, { once: true });
        });

        block.addEventListener("mouseleave", function () {
            console.log('Мышь убрана с кнопки .hover1');
            waveLeft.style.animation = ""; // Возвращаем исходную анимацию из CSS
            waveRight.style.animation = "";
            waveLeft.style.backgroundColor = "transparent";
            waveRight.style.backgroundColor = "transparent";
        });
    });

    // Обработка всех элементов с классом .hover2
    hoverBlock2.forEach(function (block) {
        block.addEventListener("mouseenter", function () {
            console.log('Мышь наведена на кнопку .hover2');
            waveLeft2.style.animation = "wave-left 2s  ";
            waveRight2.style.animation = "wave-right 2s ";
             waveLeft2.style.backgroundColor = "#1758FF";
            waveRight2.style.backgroundColor = "#1758FF";
            // Применяем прозрачный цвет после завершения анимации
            waveLeft2.addEventListener("animationend", function handler() {
            waveLeft2.style.backgroundColor = "transparent";
            waveLeft2.removeEventListener("animationend", handler);
        }, { once: true });

            waveRight2.addEventListener("animationend", function handler() {
            waveRight2.style.backgroundColor = "transparent";
            waveRight2.removeEventListener("animationend", handler);
        }, { once: true });
        });

        block.addEventListener("mouseleave", function () {
            console.log('Мышь убрана с кнопки .hover2');
            waveLeft2.style.animation = ""; // Возвращаем исходную анимацию из CSS
            waveRight2.style.animation = "";
            waveLeft2.style.backgroundColor = "transparent";
            waveRight2.style.backgroundColor = "transparent";
        });
    });
//Увеличить размер
    function logo_anim() {
        setTimeout(() => {
            const logo_animed = document.querySelector('#logo_for_anim');
            logo_animed.classList.add('logo_animed');
        }, 1500); // Задержка в миллисекундах (1.5 секунды)

        const elements = document.querySelectorAll(".group_for_anim g"); // находим все кнопки
        elements.forEach((element) => { // проходимся циклом по массиву кнопок которые мы нашли
            console.log(element)
            element.addEventListener("click", () => { 
                element.classList.toggle("active"); 
            })
        })
    }

    function application() {
        const discuss_btn = document.querySelector('#discuss_btn');
        const discuss_overlay = document.querySelector('.discuss_overlay');
        const discuss_exit = document.querySelector('#discuss_exit');

        discuss_btn.addEventListener("click", () => {
            if (menu.classList.contains('menu_opened')) {
                menu_btn.dispatchEvent(new Event('click'));
                discuss_overlay.classList.add('active');
            } else {
                discuss_overlay.classList.add('active');
            }
        });

        discuss_exit.addEventListener("click", () => {
            discuss_overlay.classList.remove('active');
        });

    }   

    function menuInner() {
        const menu_btn = document.querySelector('#menu_btn');
        const menu = document.querySelector('#menu');
        const menu_wrapper = document.querySelector('#heder_wrapper');

        const margin = menu_btn.offsetWidth;

        menu_btn.addEventListener("click", () => {  
            menu_btn.style.setProperty("--margin_exit", `${margin}px`);

            if (menu_btn.classList.contains('menu_btn')) {
                menu_btn.classList.remove('menu_btn');
                menu_btn.classList.add('menu_exit');
                menu_wrapper.classList.add('heder_wrapper');
            } else {
                menu_btn.classList.add('menu_btn');
                menu_btn.classList.remove('menu_exit');
                menu_wrapper.classList.remove('heder_wrapper');
            }

            menu.classList.toggle('menu_opened')
        });

        let lastScroll = 0;
        const defaultOffset = 200;
        const header = document.querySelector('header');

        const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
        const containHide = () => header.classList.contains('hide');

        const discuss_overlay = document.querySelector('.discuss_overlay');

        window.addEventListener('scroll', () => {

            if(scrollPosition() > lastScroll && !containHide() && !discuss_overlay.classList.contains('active') && !menu.classList.contains('menu_opened')) {
                header.classList.add('hide');
                // console.log('down');
            }

            else if(scrollPosition() < lastScroll && containHide()) {
                // console.log('up');
                header.classList.remove('hide');
            }

            lastScroll = scrollPosition();
        });
    }

    function initCursorEffect() {
        const links = document.querySelectorAll(".link-menu");

        links.forEach((link) => {
            // При движении мыши внутри ссылки
            link.addEventListener("mousemove", (e) => {
                const rect = link.getBoundingClientRect();

                // Координаты для псевдоэлемента ::before
                const beforeWidth = rect.width * 1.5; // Ширина ::before (150%)
                const beforeHeight = rect.height * 2.5; // Высота ::before (200%)

                const x = e.clientX - (rect.left - (beforeWidth - rect.width) / 2);
                const y = e.clientY - (rect.top - (beforeHeight - rect.height) / 2);

                // Координаты для псевдоэлемента ::after
                const x1 = e.clientX - rect.left;
                const y1 = e.clientY - rect.top;

                // Устанавливаем CSS-переменные для позиции
                link.style.setProperty("--cursor-x", `${x}px`);
                link.style.setProperty("--cursor-y", `${y}px`);
                link.style.setProperty("--cursor-x1", `${x1}px`);
                link.style.setProperty("--cursor-y1", `${y1}px`);

                // Делаем кружки видимыми
                link.classList.add("active");
            });

            // Добавляем проверку на выход за границы ссылки
            document.addEventListener("mousemove", (e) => {
                const rect = link.getBoundingClientRect();
                const isCursorOutside =
                    e.clientX < rect.left ||
                    e.clientX > rect.right ||
                    e.clientY < rect.top ||
                    e.clientY > rect.bottom;

                if (isCursorOutside) {
                    // Убираем видимость псевдоэлементов
                    link.classList.remove("active");
                }
            });
        });
    }

    //Анимация стрелки

    // Получаем div для рендера
const container = document.querySelector('.anim-arrow');

// Основные компоненты
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 0);
// const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientHeight); // Размер рендера = размер div
container.appendChild(renderer.domElement); // Добавляем канвас в div

// Освещение
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 5.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Камера
camera.position.z = 5;

// Управление камерой
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enableRotate = false;

// Загрузка модели
let model, mixer;
const loader = new GLTFLoader();
loader.load(
    modelArrowPath, // Путь к вашему файлу
    (gltf) => {
        model = gltf.scene;
        scene.add(model.rotateZ(-0.2).rotateY(-0.2).rotateX(0.5));
        model.scale.set(3.5, 3.5, 3.5);
    },
    (progress) => console.log(`Загрузка: ${(progress.loaded / progress.total) * 100}%`),
    (error) => console.error('Ошибка загрузки:', error)
    
);

// Следование за курсором
document.addEventListener('mousemove', (event) => {
    if (model) {
        const rect = container.getBoundingClientRect(); // Позиция div на экране
        const mouseX = ((event.clientX - rect.left) / container.clientWidth) * 1 - 1;
        const mouseY = -((event.clientY - rect.top) / container.clientHeight) * 1 + 1;

        model.rotation.y = mouseX * 0.05; // Поворот по оси Y
        model.rotation.x = mouseY * 0.15; // Поворот по оси X
        model.rotation.z = -(mouseX * 0.1); // Поворот по оси Z
    }
});

// Анимационный цикл
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);

    if (mixer) {
        const delta = clock.getDelta();
        mixer.update(delta);
    }

    controls.update();
    renderer.render(scene, camera);
}
animate();

// Адаптация при изменении размера окна
window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});
   
});
