function radomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function radomColor(min, max) {
    let r = radomNum(min, max);
    let g = radomNum(min, max);
    let b = radomNum(min, max);
    return "rgb(" + r + "," + g + "," + b + ")";
}
let str1 = "";
// drawPic();
$('#change').on('click', function() {
    str1 = "";
    $('#change').empty()
    let html = ' <canvas id="canvas" width="100px" height="50px"></canvas>'
    $('#change').append(html)
    drawPic();
})

function drawPic() {
    str1 = "";
    //		let con=document.getElementById("container");
    let canvas = document.getElementById("canvas");
    let cxt = canvas.getContext("2d");
    let x = canvas.width;
    let y = canvas.height;
    cxt.clearRect(0, 0, x, y);
    cxt.fillStyle = radomColor(180, 255);
    cxt.fillRect(0, 0, x, y);
    //		con.removeChild(canvas);
    //		cxt.clearRect(0,0,x,y);
    //		con.appendChild(canvas);

    let txt = 'abcdefghijklmnopqrstuvwxyz1234567890';
    for (let i = 0; i < 4; i++) {
        let number = Math.random() * txt.length;
        let str = txt.substr(number, 1);
        str1 = str1 + str;
        cxt.font = "30px SimHei";
        cxt.fillStyle = radomColor(40, 180);
        let xx = 20 * i + 5;
        let yy = radomNum(30, 40);
        let angless = radomNum(-40, 40) * Math.PI / 180;
        cxt.translate(xx, yy);
        cxt.rotate(angless);
        cxt.fillText(str, 0, 0);
        cxt.rotate(-angless);
        cxt.translate(-xx, -yy);

    }

    // 线
    // for (let i = 0; i < 20; i++) {
    //     cxt.strokeStyle = radomColor(40, 180);
    //     cxt.beginPath();
    //     cxt.moveTo(radomNum(0, x), radomNum(0, y));
    //     cxt.lineTo(radomNum(0, x), radomNum(0, y));
    //     cxt.stroke();
    // }
    // 点
    // for (let i = 0; i < 70; i++) {
    //     cxt.fillStyle = radomColor(40, 180);
    //     cxt.beginPath();
    //     cxt.arc(radomNum(0, x), radomNum(0, y), 1, 0, 2 * Math.PI);
    //     cxt.fill();
    // }

}

// $('#sub').on('click', function() {
function check() {
    let str2 = $('#abc').val()
        // alert('验证码' + str2 + '%' + str1)
    if (str2 != '') {
        if (str1 == str2) {
            return true;
        } else {
            drawPic();
            return false;
        }
    } else {
        alert("验证码不能为空");
        drawPic();
        return false;
    }
    return false
}
// })