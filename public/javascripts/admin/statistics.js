/**
 * Created by dreamIt on 2017/4/28.
 */
$(function(){
    var myChart = echarts.init(document.getElementById('container'));
    $.get('/admin/monthSta',function(json){
        var data = json.data;
        option = {
            backgroundColor: '#2c343c',

            title: {
                text: '借阅量前十统计',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#ccc'
                }
            },

            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },

            visualMap: {
                show: false,
                min: 1,
                max: 20,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series: [{
                name: '借阅量',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: data.sort(function(a, b) {
                        return a.value - b.value
                    }),
                roseType: 'angle',
                label: {
                    normal: {
                        textStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        },
                        smooth: 0.2,
                        length: 10,
                        length2: 20
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#c23531',
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },

                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function(idx) {
                    return Math.random() * 200;
                }
            }]
        };

        myChart.setOption(option)
    })

})
