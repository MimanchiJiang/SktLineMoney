<template>
  <Layout class="layout">
    <h1 class="title3">青云记账</h1>
    <Tabs
      class-prefix="type"
      :data-source="recordTypeList"
      :value.sync="type"
    />
    <router-link to="/Money">
      <button class="float"><Icon name="add" class="icon" /></button
    ></router-link>
    <nav>
      <div class="chart-wrapper" ref="chartWrapper" id="chart1">
        <Chart class="chart" :options="chartOptions" />
      </div>
      <div class="chart-wrapper2" ref="chartWrapper2">
        <Chart class="chart2" :options="chartOptions2" />
      </div>
    </nav>
  </Layout>
</template>


<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import recordTypeList from "@/constants/recordTypeList";
import dayjs from "dayjs";
import clone from "@/lib/clone";
import Chart from "@/components/Chart.vue";
import _, { sum } from "lodash";
import day from "dayjs";
import Tabs from "@/components/Tabs.vue";
@Component({
  components: { Chart, Tabs },
})
export default class Statistics extends Vue {
  tagString(tags: Tag[]) {
    return tags.length === 0 ? "无" : tags.map((t) => t.name).join("，");
  }

  mounted() {
    (this.$refs.chartWrapper as HTMLDivElement).scrollLeft = 9999;
    // const div = this.$refs.chartWrapper as HTMLDivElement;
    // div.scrollLeft = div.scrollWidth;
  }

  beautify(string: string) {
    const day = dayjs(string);
    const now = dayjs();
    if (day.isSame(now, "day")) {
      return "今天";
    } else if (day.isSame(now.subtract(1, "day"), "day")) {
      return "昨天";
    } else if (day.isSame(now.subtract(2, "day"), "day")) {
      return "前天";
    } else if (day.isSame(now, "year")) {
      return day.format("M月D日");
    } else {
      return day.format("YYYY年M月D日");
    }
  }

  get keyValueList() {
    const today = new Date();
    const array = [];
    for (let i = 0; i <= 29; i++) {
      const dateString = day(today).subtract(i, "day").format("YYYY-MM-DD");
      const found = _.find(this.groupedList, {
        title: dateString,
      });
      array.push({
        key: dateString,
        value: found ? found.total : 0,
      });
    }
    array.sort((a, b) => {
      if (a.key > b.key) {
        return 1;
      } else if (a.key === b.key) {
        return 0;
      } else {
        return -1;
      }
    });
    return array;
  }

  get chartOptions() {
    const keys = this.keyValueList.map((item) => item.key);
    const values = this.keyValueList.map((item) => item.value);

    return {
      grid: {
        left: 0,
        right: 0,
        bottom: 150,
      },
      xAxis: {
        type: "category",
        data: keys,
        axisTick: { alignWithLabel: true },
        axisLine: { lineStyle: { color: "#666" } },
        axisLabel: {
          formatter: function (value: string, index: number) {
            return value.substr(5);
          },
        },
      },
      yAxis: {
        type: "value",
        show: false,
      },
      series: [
        {
          color: "#cce3e8",
          symbol: "circle",
          symbolSize: 12,
          itemStyle: {
            normal: { label: { show: true, color: "#cce3e8" } },
          },
          lineStyle: { color: "#cce3e8" },
          data: values,
          type: "line",
        },
      ],
      tooltip: {
        show: true,
        triggerOn: "click",
        position: "top",
        formatter: "{c}",
      },
    };
  }

  get chartOptions2() {
    const keys = this.keyValueList.map((item) => item.key);

    return {
      grid: {
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
      },
      xAxis: {
        type: "category",
        data: keys,
        axisTick: { alignWithLabel: true },
        axisLine: { lineStyle: { color: "#666" } },
        axisLabel: {
          formatter: function (value: string, index: number) {
            return value.substr(5);
          },
        },
      },
      yAxis: {
        type: "value",
        show: false,
      },
      emphasis: {
        label: {
          show: true,

          fontWeight: "bold",
        },
      },

      series: [
        {
          radius: ["40%", "70%"],
          name: "Access From",
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          type: "pie",
          data: this.tagGroupedList.map((v) => ({
            name: v.tag.name,
            value: v.total,
          })),
        },
      ],
      tooltip: {
        show: true,
        triggerOn: "click",
        position: "top",
        formatter: "{c}",
      },
    };
  }
  get tagGroupedList() {
    const { recordList } = this;
    const newList = clone(recordList).filter((r) => r.type === this.type);
    // 先筛选出记录中的所有tag并去重
    const allTags = newList
      .map((r) => r.tags)
      .filter((t) => t !== null)
      .reduce((sum, current) => [...sum, ...current], []);
    const uniqTags = _.uniqBy(allTags, "id");
    // 再以tag为基准，对收支记录进行分组；即我们需要知道：某个tag，它对应有哪些收支记录
    const groupedList = uniqTags.map((tag) => {
      const tagRecords = newList.filter((r) =>
        r.tags.find((t) => t.id === tag.id)
      );
      const total = tagRecords.reduce((sum, item) => {
        return sum + item.amount;
      }, 0);
      return {
        tag,
        total,
        records: tagRecords,
      };
    });
    // 返回我们已经分好组的数组，再在chartOptions中适当调整后使用即可
    return groupedList;
  }

  get recordList() {
    return (this.$store.state as RootState).recordList;
  }

  get groupedList() {
    const { recordList } = this;

    const newList = clone(recordList)
      .filter((r) => r.type === this.type)
      .sort(
        (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
      );
    if (newList.length === 0) {
      return [];
    }
    type Result = { title: string; total?: number; items: RecordItem[] }[];
    const result: Result = [
      {
        title: dayjs(newList[0].createdAt).format("YYYY-MM-DD"),
        items: [newList[0]],
      },
    ];
    for (let i = 1; i < newList.length; i++) {
      const current = newList[i];
      const last = result[result.length - 1];
      if (dayjs(last.title).isSame(dayjs(current.createdAt), "day")) {
        last.items.push(current);
      } else {
        result.push({
          title: dayjs(current.createdAt).format("YYYY-MM-DD"),
          items: [current],
        });
      }
    }
    result.map((group) => {
      group.total = group.items.reduce((sum, item) => {
        return sum + item.amount;
      }, 0);
    });
    return result;
  }

  beforeCreate() {
    this.$store.commit("fetchRecords");
  }

  type = "-";
  recordTypeList = recordTypeList;
}
</script>

<style lang="scss" scoped>
@import "~@/assets/style/helper.scss";
.title3 {
  color: black;
  background-color: black;
  text-shadow: rgba(255, 255, 255, 0.5) 0 5px 6px,
    rgba(255, 255, 255, 0.2) 1px 3px 3px;
  -webkit-background-clip: text;
  text-align: center;
  background: rgb(189, 211, 215);
}
.chart-wrapper {
  height: 250px;
}
.chart-wrapper2 {
  height: 200px;
}

.chart2 {
  height: 200px;
}
.chart {
  height: 250px;
  width: 430%;
  &-wrapper {
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.float {
  position: absolute;
  right: 0;
  top: 80%;
  touch-action: none;
  text-align: center;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  line-height: 48px;
  background: $color-lightPurple;
  border: none;
  > .icon {
    height: 40px;
    width: 40px;
    color: white;
    margin-top: 10px;
  }
}
</style>