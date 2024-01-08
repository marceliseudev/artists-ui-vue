<template>
  <div>
    <CAlert color="danger" closeButton :show.sync="showAlert">
      {{ errorMsg }}
    </CAlert>

    <CCard>
      <CCardHeader>
        <CRow>
          <CCol>
            <h4 id="traffic" class="card-title mb-0">Artists</h4>
          </CCol>
        </CRow>
      </CCardHeader>

      <template>
        <CCardBody>
          <CDataTable
            class="mb-0 table-outline"
            :items="tableItems"
            :fields="tableFields"
            head-color="light"
            :tableFilter="{
              external: false,
              lazy: false,
              label: 'Filter:',
            }"
            items-per-page-select
            :items-per-page="10"
            hover
            striped
            sorter
            pagination
            :noItemsView="{
              noResults: 'No results',
              noItems: 'No items',
            }"
          >
            <template #show_details="{item, index}">
              <td class="py-1">
                <CButton
                  color="primary"
                  variant="outline"
                  square
                  size="sm"
                  @click="showAlbumforArtist(item, index)"
                >
                  Show Album
                </CButton>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </template>
    </CCard>
  </div>
</template>

<script>
import ArtistsAPI from "@/service/ArtistsAPI";

export default {
  name: "Negociações",
  components: {},
  mounted() {
    this.getArtists();
  },
  data() {
    return {
      loading: true,
      showAlert: false,
      errorMsg: "",
      tableItems: [],
      tableFields: [
        { key: "id", label: "Id", _classes: "text-center" },
        { key: "name", label: "Name", _classes: "text-center" },
        { key: "twitter", label: "Twitter", _classes: "text-center" },
        {
          key: "show_details",
          label: "",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
      ],
      options: {
        lock: true,
        text: "Loading...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
    };
  },
  computed: {},
  methods: {
    async getArtists() {
      let loadingInstance = this.$loading(this.options);
      let result = await ArtistsAPI.listArtists();
      if (result.status === 200) {
        let artists = [];
        result.data.forEach((element) => {
          artists.push(element[0]);
        });
        this.tableItems = artists;
        this.tableItems = result.data;
      }
      loadingInstance.close();
    },
    async showAlbumforArtist(item) {
      this.$router.push({ name: "Albums", params: { artistName: item.name } });
    },
  },
};
</script>
