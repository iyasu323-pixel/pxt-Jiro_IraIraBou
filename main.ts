/**
 * ■仕様
 * 
 * ・Aボタン：ゲームの開始
 * 
 * ・Bボタン：ゴール
 * 
 * ・P0端子：杖のプルアップ入力（コース接触時に0）
 * 
 * ・P1端子：ゴール・スイッチのプルアップ入力（ゴール時に0）
 * 
 * ・P12端子：杖の青LED（1で点灯）・・・・オプション
 * 
 * ・P13端子：末の赤LED（1で点灯）・・・・オプション
 */
function ゴールした時の処理 () {
    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerUp), music.PlaybackMode.InBackground)
    basic.showString("Goal")
    for (let index = 0; index < 4; index++) {
        pins.digitalWritePin(DigitalPin.P12, 0)
        pins.digitalWritePin(DigitalPin.P13, 1)
        basic.pause(200)
        pins.digitalWritePin(DigitalPin.P12, 1)
        pins.digitalWritePin(DigitalPin.P13, 0)
        basic.pause(200)
    }
    pins.digitalWritePin(DigitalPin.P12, 0)
    pins.digitalWritePin(DigitalPin.P13, 0)
}
input.onButtonPressed(Button.A, function () {
    演出中 = 1
    失敗回数 = 0
    開始時間 = control.millis()
    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.JumpUp), music.PlaybackMode.InBackground)
    basic.showNumber(失敗回数)
    // 演出中（開始～ゴール）は青LEDを点灯させる
    pins.digitalWritePin(DigitalPin.P12, 1)
    // 演出中（開始～ゴール）は青LEDを点灯させる
    pins.digitalWritePin(DigitalPin.P13, 0)
})
function 開始前の処理 () {
    basic.showLeds(`
        . # # # .
        # # # # #
        # . # . #
        # # # # #
        . # # # .
        `)
}
let 終了時間 = 0
let 開始時間 = 0
let 失敗回数 = 0
let 演出中 = 0
pins.setPull(DigitalPin.P0, PinPullMode.PullUp)
pins.setPull(DigitalPin.P1, PinPullMode.PullUp)
演出中 = 0
開始前の処理()
basic.forever(function () {
    if (演出中 == 1) {
        if (input.buttonIsPressed(Button.B) || pins.digitalReadPin(DigitalPin.P1) == 0) {
            演出中 = 0
            終了時間 = control.millis()
            ゴールした時の処理()
            basic.showString("TIME" + (終了時間 - 開始時間) + "ms")
            開始前の処理()
        } else {
            if (pins.digitalReadPin(DigitalPin.P0) == 0) {
                // コースに接触したら赤LEDを点灯
                pins.digitalWritePin(DigitalPin.P13, 1)
                basic.showLeds(`
                    # . . . #
                    . # . # .
                    . . # . .
                    . # . # .
                    # . . . #
                    `)
                pins.digitalWritePin(DigitalPin.P13, 0)
                music._playDefaultBackground(music.builtInPlayableMelody(Melodies.BaDing), music.PlaybackMode.InBackground)
                basic.pause(100)
                失敗回数 += 1
                basic.showNumber(失敗回数)
            }
        }
    }
})
