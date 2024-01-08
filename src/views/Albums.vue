<template>
  <div>
    <CAlert color="danger" closeButton :show.sync="showAlert">
      {{ errorMsg }}
    </CAlert>

    <CCard>
      <CCardHeader>
        <CRow>
          <CCol>
            <h4 id="traffic" class="card-title mb-0">Albums</h4>
          </CCol>
        </CRow>
      </CCardHeader>

      <template>
        <CCardBody>
          <CRow>
            <CCol sm="2">
              <CButton
                color="primary"
                variant="outline"
                v-on:click="
                  resetForm('ruleForm');
                  addAlbumModal = true;
                  msg = '';
                  showAlert2 = false;
                "
              >
                <b-icon icon="plus-circle"></b-icon> New Album
              </CButton>
            </CCol>
            <CCol sm="8"> </CCol>
            <CCol sm="2">
              <CButton
                color="primary"
                variant="outline"
                v-on:click="getAlbums()"
              >
                <CIcon name="cil-reload" /> Refresh
              </CButton>
            </CCol>
            <CCol> </CCol>
          </CRow>

          <CDataTable
            class="mb-0 table-outline"
            :items="tableItems"
            :fields="tableFields"
            head-color="light"
            :tableFilter="{ external: false, lazy: false, label: 'Filter:' }"
            :tableFilterValue="this.artistName"
            items-per-page-select
            :items-per-page="10"
            hover
            striped
            sorter
            pagination
            :noItemsView="{
              noResults: 'No results',
              noItems: 'No items found',
            }"
          >
            <template #show_details="{item, index}">
              <td class="py-2">
                <CButton
                  color="primary"
                  variant="outline"
                  square
                  size="sm"
                  v-on:click="
                    resetForm('ruleForm');
                    editAlbumModal = true;
                    msg = '';
                    showAlert2 = false;
                    ruleForm.artist = item.artist;
                    ruleForm.year = new Date();
                    ruleForm.year.setFullYear(item.year);
                    ruleForm.name = item.name;
                    ruleForm.albumId = item.albumId;
                  "
                >
                  Edit
                </CButton>
              </td>
              <div v-if="userData.isAdmin">
                <td class="py-2">
                  <CButton
                    v-if="itemDeleted.indexOf(item.albumId) >= 0"
                    color="primary"
                    variant="outline"
                    square
                    pressed
                    size="sm"
                  >
                    {{ Boolean(item._removed) ? "Deleted" : "Delete" }}
                  </CButton>
                  <CButton
                    v-else
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="deleteAlbum(item, index)"
                  >
                    {{ Boolean(item._removed) ? "Deleted" : "Delete" }}
                  </CButton>
                </td>
              </div>
            </template>
          </CDataTable>
        </CCardBody>
      </template>
    </CCard>

    <CModal
      :show.sync="addAlbumModal"
      :no-close-on-backdrop="true"
      :centered="false"
      title="New Album"
      size="lg"
      color="dark"
    >
      <el-row type="flex" justify="center" :gutter="0">
        <el-form
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
        >
          <el-col :sm="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="artist">
                <el-autocomplete
                  class="inline-input"
                  v-model="ruleForm.artist"
                  value-key="name"
                  :fetch-suggestions="querySearchArtists"
                  size="small"
                  placeholder="Artist"
                  @select="handleSelectArtists"
                ></el-autocomplete>
              </el-form-item>
            </div>
          </el-col>

          <el-col :sm="5">
            <div class="grid-content bg-purple">
              <el-form-item prop="name">
                <el-input
                  v-model="ruleForm.name"
                  size="small"
                  placeholder="Name"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>

          <el-col :sm="5">
            <el-form-item prop="year">
              <div class="grid-content bg-purple">
                <el-date-picker
                  :rules="rules"
                  v-model="ruleForm.year"
                  type="year"
                  placeholder="Pick a year"
                  clearable
                >
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <template #footer>
        <CCol col="12">
          <CAlert closeButton :show.sync="showAlert2" :color="colorAlert2">
            {{ msgAlert2 }}
          </CAlert>
          <CButton
            @click="
              resetForm('ruleForm');
              addAlbumModal = false;
            "
            color="danger"
            >Back</CButton
          >
          <CButton @click="addAlbum('ruleForm')" color="success">Add</CButton>
        </CCol>
      </template>
    </CModal>

    <CModal
      :show.sync="editAlbumModal"
      :no-close-on-backdrop="true"
      :centered="false"
      title="Modify Album"
      size="lg"
      color="dark"
    >
      <el-row type="flex" justify="center" :gutter="0">
        <el-form
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
          required
        >
          <el-col :sm="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="artist">
                <el-autocomplete
                  class="inline-input"
                  v-model="ruleForm.artist"
                  value-key="name"
                  :fetch-suggestions="querySearchArtists"
                  size="small"
                  placeholder="Artist"
                  @select="handleSelectArtists"
                ></el-autocomplete>
              </el-form-item>
            </div>
          </el-col>

          <el-col :sm="5">
            <div class="grid-content bg-purple">
              <el-form-item prop="name">
                <el-input
                  v-model="ruleForm.name"
                  size="small"
                  placeholder="Name"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>

          <el-col :sm="5">
            <el-form-item prop="year">
              <div class="grid-content bg-purple">
                <el-date-picker
                  :rules="rules"
                  v-model="ruleForm.year"
                  type="year"
                  placeholder="Pick a year"
                  clearable
                >
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <template #footer>
        <CCol col="12">
          <CAlert closeButton :show.sync="showAlert2" :color="colorAlert2">
            {{ msgAlert2 }}
          </CAlert>
          <CButton
            @click="
              resetForm('ruleForm');
              editAlbumModal = false;
            "
            color="danger"
            >Back</CButton
          >
          <CButton @click="updateAlbum('ruleForm')" color="success"
            >Update</CButton
          >
        </CCol>
      </template>
    </CModal>
  </div>
</template>

<script>
import ArtistsAPI from "@/service/ArtistsAPI";
import { mapGetters } from "vuex";

export default {
  name: "Albums",
  components: {},
  mounted() {
    this.loadArtists();
    this.getAlbums();
  },
  props: {
    artistName: String,
  },
  data() {
    return {
      ruleForm: {
        artist: "",
        name: "",
        year: "",
        albumId: "",
      },
      rules: {
        artist: [
          { required: true, message: "Select artist", trigger: "change" },
        ],
        name: [
          { required: true, message: "Enter album name", trigger: "change" },
        ],
        year: [
          {
            type: "date",
            required: true,
            message: "Enter year",
            trigger: "change",
          },
        ],
      },
      itemDeleted: [],
      itemSelected: null,
      artists: [],
      loading: true,
      showAlert: false,
      errorMsg: "",
      addAlbumModal: false,
      editAlbumModal: false,
      msgAlert2: "",
      colorAlert2: "warning",
      showAlert2: false,
      tableItems: [],
      tableFields: [
        { key: "albumId", label: "Id", _classes: "text-center" },
        { key: "name", label: "Album name", _classes: "text-center" },
        { key: "year", label: "Year", _classes: "text-center" },
        { key: "artist", label: "Artist", _classes: "text-center" },
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
  computed: {
    ...mapGetters({
      userData: "userData",
    }),
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async getAlbums() {
      let loadingInstance = this.$loading(this.options);
      let result = await ArtistsAPI.listAlbums();
      if (result.status === 200) {
        this.tableItems = result.data;
      }
      loadingInstance.close();
    },
    async addAlbum(formName) {
      let formValid = true;
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.colorAlert2 = "warning";
          this.msgAlert2 = "Please enter missing data";
          this.showAlert2 = true;
          formValid = false;
          return;
        }
      });
      if (!formValid) return;
      this.msgAlert2 = "";
      this.showAlert2 = false;
      let album = {
        artist: this.ruleForm.artist,
        name: this.ruleForm.name,
        year: this.ruleForm.year.getFullYear(),
      };
      let loadingInstance = this.$loading(this.options);
      let result = await ArtistsAPI.createAlbum(album);
      if (result.error || result.status != 200) {
        this.colorAlert2 = "warning";
        this.showAlert2 = true;
        this.msgAlert2 = "oops something went wrong";
      } else {
        this.colorAlert2 = "success";
        this.showAlert2 = true;
        this.msgAlert2 = "Album created successfully !";
      }
      loadingInstance.close();
    },
    async updateAlbum(formName) {
      let formValid = true;
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.colorAlert2 = "warning";
          this.msgAlert2 = "Please enter missing data";
          this.showAlert2 = true;
          formValid = false;
          return;
        }
      });
      if (!formValid) return;
      this.msgAlert2 = "";
      this.showAlert2 = false;
      let album = {
        albumId: this.ruleForm.albumId,
        artist: this.ruleForm.artist,
        name: this.ruleForm.name,
        year: this.ruleForm.year.getFullYear(),
      };
      let loadingInstance = this.$loading(this.options);
      let result = await ArtistsAPI.updateAlbum(album);
      if (result.error || result.status != 200) {
        this.colorAlert2 = "warning";
        this.showAlert2 = true;
        this.msgAlert2 = "oops something went wrong";
      } else {
        this.colorAlert2 = "success";
        this.showAlert2 = true;
        this.msgAlert2 = "Album update successfully !";
        this.getAlbums();
      }
      loadingInstance.close();
    },
    async deleteAlbum(item) {
      let loadingInstance = this.$loading(this.options);
      let result = await ArtistsAPI.deleteAlbum(item.albumId);
      if (result.error || result.status != 200) {
        this.showAlert = true;
        this.errorMsg = "oops something went wrong";
        item._removed = false;
      } else {
        this.showAlert = false;
        this.errorMsg = "";
        item._removed = true;
        this.itemDeleted.push(item.albumId);
      }
      loadingInstance.close();
    },
    querySearchArtists(queryString, cb) {
      let results = queryString
        ? this.artists.filter(this.createFilterArtists(queryString))
        : this.artists;
      cb(results);
    },
    createFilterArtists(queryString) {
      return (resultEntry) => {
        return (
          resultEntry.name.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    async loadArtists() {
      let result = await ArtistsAPI.listArtists();
      if (result.error || result.status != 200) {
        return null;
      } else {
        this.artists = result.data;
      }
    },
    handleSelectArtists(item) {
      this.itemSelected = item;
    },
  },
};
</script>
