<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import Condition from '../../components/Condition.vue'
import EditAni from '../../components/EditAni.vue'

type Condition = {
  sort: typeof possibleSort[number]
  reverse: boolean
  rating: number
}

const possibleSort = ['CREATEDAT', 'UPDATEDAT', 'RATING', 'RELEASEDAT'] as const
const conditionTexts: any = {
  'ALL': '全部',
  'CREATEDAT': '创建日期',
  'UPDATEDAT': '更新日期',
  'RATING': '评分',
  'RELEASEDAT': '发布日期',
}
const searchText = ref('')
const addAniRef = ref<any>(null)
const expandConditionChoose = ref(false)
const conditions = reactive<Condition>({
  sort: 'CREATEDAT',
  reverse: true,
  rating: 0,
})
const conditionSummary = computed(() => {
  const selectedCondition: string[] = []
  selectedCondition.push(`${conditionTexts[conditions.sort]} (${conditions.reverse ? '倒序' : '正序'})`)
  if (conditions.rating > 0)
    selectedCondition.push(`${conditions.rating} 星及以上`)
  return selectedCondition.join(' • ')
})
</script>

<template>
  <edit-ani ref="addAniRef" />
  <div class="container">
    <q-input rounded outlined bottom-slots v-model="searchText" label="搜索" class="search">
      <template v-slot:append>
        <q-icon v-if="searchText !== ''" name="close" @click="searchText = ''" class="close-icon" />
        <q-icon v-else name="search" />
      </template>
    </q-input>
    
    <div>
      <q-btn
        flat
        size="lg"
        align="between"
        color="black"
        class="full-width"
        @click="expandConditionChoose = !expandConditionChoose"
      >
        <div class="condition-btn">
          <div class="left">
            <div class="title">筛选</div>
            <div class="condition-summary">
              {{ conditionSummary }}
            </div>
          </div>
          <q-icon :name="expandConditionChoose ? 'expand_less' : 'expand_more'" />
        </div>
      </q-btn>
      <q-slide-transition>
        <div v-show="expandConditionChoose">
          <condition name="排序">
            <template #left>
              <q-btn
                v-for="sort of possibleSort"
                flat
                :color="conditions.sort === sort ? 'primary' : 'black'"
                :label="conditionTexts[sort]"
                @click="conditions.sort = sort"
              />
            </template>
            <template #right>
              <q-checkbox v-model="conditions.reverse" label="倒序" />
            </template>
          </condition>

          <condition name="评分">
            <template #left>
              <q-rating
                v-model="conditions.rating"
                :max="10"
                color="primary"
              />
            </template>
            <template #right>
              <span class="tip">
                会显示大于所选评分的动画
              </span>
            </template>
          </condition>
        </div>
      </q-slide-transition>
    </div>

    <q-btn color="secondary" icon="add" label="添加动画" @click="addAniRef.toggle()" />
  </div>
</template>
<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .search {
    padding-bottom: 0;
  }

  .close-icon {
    cursor: pointer;
  }
  
  .tip {
    color: gray;
    font-size: .9rem;
  }

  .condition-btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      align-items: center;
      gap: 10px;

      .title {
        font-size: 20px;
      }
      
      .condition-summary {
        color: gray;
        font-size: .8rem;
      }
    }
  }
}
</style>
  