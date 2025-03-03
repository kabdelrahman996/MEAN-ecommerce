import { Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-all-products',
  standalone: false,
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.css',
})
export class AllProductsComponent {
  apiUrl = environment.apiUrl;
  products: any[] = [];
  categories: any[] = [];
  productForm!: FormGroup;
  selectedFiles: File[] = [];
  updateForm!: FormGroup;
  selectedProduct: any = null;

  constructor(private fb: FormBuilder, private service: ProductsService) {
    this.initProductsForm();
    this.initUpdateForm();
  }

  ngOnInit() {
    this.getAllProducts();
    this.getAllCategories();
  }

  initProductsForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      brand: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      countInStock: [0, [Validators.required, Validators.min(0)]],
      rating: [0],
      numReviews: [0],
      isFeatured: [false],
    });
  }

  initUpdateForm() {
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      countInStock: ['', Validators.required],
      brand: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      isFeatured: [false],
    });
  }

  setSelectedProduct(product: any) {
    this.selectedProduct = product;
    this.updateForm.patchValue({
      name: product.name,
      price: product.price,
      countInStock: product.countInStock,
      brand: product.brand,
      description: product.description,
      isFeatured: product.isFeatured,
      category: product.category.id,
    });
  }

  getAllProducts() {
    this.service.getAllProducts().subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.products = res.data;
        }
      },
      (err) => {
        alert(err.error.message);
      }
    );
  }

  getAllCategories() {
    this.service.getAllCategories().subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.categories = res.data;
        }
      },
      (err) => {
        alert(err.error.message);
      }
    );
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  getSelectedCategory(event: any) {
    const selectedCategoryId = event.target.value;
    this.productForm.patchValue({ category: selectedCategoryId });
  }

  updateSelectedCategory(event: any) {
    const selectedCategoryId = event.target.value;
    this.updateForm.patchValue({ category: selectedCategoryId });
  }

  submit() {
    const formData = new FormData();

    Object.keys(this.productForm.controls).forEach((key) => {
      formData.append(key, this.productForm.get(key)?.value);
    });

    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file) => {
        formData.append('images', file);
      });
    }

    this.service.addProduct(formData).subscribe(
      (res: any) => {
        if (res.status == 'success') {
          alert('Product Successfully Added!');
          this.getAllProducts();
        }
      },
      (err) => {
        alert(err.error.message);
      }
    );
  }

  updateProduct() {
    const model = this.updateForm.value;
    this.service
      .updateExistingProduct(this.selectedProduct.id, model)
      .subscribe(
        (res: any) => {
          if (res.status == 'success') {
            alert('Product Successfully Updated');
            this.getAllProducts();
          }
        },
        (err) => {
          alert(err.error.message);
        }
      );
  }
}
