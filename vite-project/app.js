import * as THREE from './node_modules/three';
import "./style.css";
import gsap from 'gsap'
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js" ;//Импортируем модуль для того что бы наш шарик крутился

//Scene
const scene = new THREE.Scene(); //Создание обычной сцены куда будем помещать элементы

//Заготовка сферы - все просто еслі разобраться , на первый взгляд только сложно.
const geometry = new THREE.SphereGeometry(3,64,64); //Создаем геометрическое тело (Сферу) - заготовку точнее как із гліны начальный предмет все аргументы если что отвечают за сглаживание , конкретное сглаживание для каждого элемента можно найти в документации three.js так что тут все по дефолту
const material = new THREE.MeshStandardMaterial({  //Создаем матеріал вплане настройкі обьекта такіе как цвет і т.д.
    color: '#00ff83',
})
const mesh = new THREE.Mesh(geometry,material);//Создаем окончательный элемент на базе заготовки из сферы и материала
scene.add(mesh); //Добавляем наше окончательное тело сферу в сцену

//Задаем размеры что б наша сцена занимала весь экран
const sizes = {
    width: window.innerWidth, // В дальнейшем благодаря этим величинам мы установим обзор камеры на 26 строчке
    height: window.innerHeight,
}

//Световое освещение для адекватного показа
const light = new THREE.PointLight(0xffffff, 1, 100) //Простое добавление цвета первый аргумент это цвет сам а вторые и 3 взяты из документации так что тоже что то дефолтное и простое можно не вдаваться в детали
light.position.set(0,10,10) // Указываем будущие координаты лампы которую в след строчке добавим
scene.add(light); //Добавляем цвет на сцену

//Камера наблюдения за нашим телом
const camera = new THREE.PerspectiveCamera(45,sizes.width/sizes.height); //Добавляем камеру что бы мы могли увидеть наше тело/сцену , без этого у нас будет существовать сфера но мы ее не заметим. 1 элемент в скобках это градусы просмотра по вертикали а остальные 2 это размеры камеры то есть то что можем просматривать (что поместится в нее).
camera.position.z = 20; //Отдаляем камеру от обьекта
scene.add(camera) //Добавляем камеру в сцену

//Этот участок кода занимается добавлением всего выше на страницу , ведь что бы окончательно это увидеть мы должны поместит обьект на страницу- что очень логично.
const canvas = document.querySelector('.webgl');//Находим место для помещения
const renderer = new THREE.WebGLRenderer({canvas});//Стандартная манипуляция с выбранным местом
renderer.setSize(sizes.width,sizes.height); //Задаем размеры как и в камере в приципе все логично
renderer.render(scene,camera); //Совмещаем все наше добро в одно целое то есть соединяем камеру и сцену дабы увидеть хоть что то
renderer.setPixelRatio(2);//Увеличиваем концентрацию пикселей изображения для более четкого вида

//Обработчик событий для изменения размера
window.addEventListener('resize',()=>{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight //Данные строки кода позволяют обновлять размер содержимого страницы в зависимости от размера экрана устройства
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width,sizes.height) //Идет простое обновление размера нашего хтмл элемента в зависимости от того как меняем размеры окна браузера
})

const controls = new OrbitControls(camera,canvas) //Создаем переменную через которую будет контролировать орбитальное движение нашего элемента
controls.enableDamping = true //Включаем плавность во время вращения обьекта
controls.enablePan = false //Когда это свойство тру мы можем перемещать наш обьект по странице зажав правую клавишу , а это нам не нужно.
controls.enableZoom = false //Когда это свойство тру мы можем увеличивать наш обьект а нам это не нужно в нашем сайте
controls.autoRotate = true //Включаем автоповорот нашему обьекту 
controls.autoRotateSpeed = 5 //Задаем скорость вращению

const loop = ()=>{
    controls.update(); //Добавляем якобы оживление обьекту , не обязательно но так смотрится лучше во время того как мы взаимодействуем с нашим обьектом
    mesh.setRotationFromAxisAngle.x += 0.2
    renderer.render(scene,camera);
    window.requestAnimationFrame(loop)
}
loop();

//Временная шкала(Анимация)
const tl = gsap.timeline({defaults:{duration: 1}})
tl.fromTo(mesh.scale,{z:0,x:0,y:0},{z:1,x:1,y:1})
tl.fromTo('nav',{y:'-100%'},{y:'0%'})
tl.fromTo('.title',{opacity:0},{opacity:1}) //Весь код в данном этапе отвечает за эффектное появление навбара и анимации нашего текста !Но это очень сильно влияет на оптимизацию и данную анимацию лучше отключить для поддержки всех устройств

//Анимация Мыши
let mouseDown = false,
    rgb = [];
window.addEventListener('mousedown',()=>{
    mouseDown = true
})
window.addEventListener('mouseup',()=>{
    mouseDown = false
}) //Отслеживаем обработчиком события действия с нашей мышью . ведь мы хотим изменять что либо когда пользователь пользуется сайтом , а значит возможно на что то кликает либо перетаскивает

window.addEventListener('mousemove',(e)=>{
    if(mouseDown){
        rgb = [
            Math.round((e.pageX / sizes.width)*255),
            Math.round((e.pageY / sizes.height)*255), // В данных строчках создаем прослушиватель событий для изменения цвета в зависимости от положения , третий аргумент 150 дает любой оттенок в нашем случае синий
            150,
        ]
        //Тут мы анимируем
        let newColor = new THREE.Color(`rgb(${rgb.join(',')})`) //Черещ джоин выделяем из массива цвет
        
        gsap.to(mesh.material.color,{
            r:newColor.r,
            g:newColor.g,
            b: newColor.b
        }) // Меняем материал то есть обьект свойств нашего элемента в данном случае меняем цвет 
    }
})