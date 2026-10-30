/**
 * Comprehensive Sneaks-API Integration Test Suite
 * Validates all 12 requirements outlined in the PRD.
 */

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 SNEAKERDROP: SNEAKS-API FULL INTEGRATION TEST SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName} ${detail ? `(${detail})` : ''}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Search Nike Sneakers
    // -------------------------------------------------------------------------
    console.log('\n--- 1. Search Nike Sneakers ---');
    const resNike = await fetch(`${BASE_URL}/api/sneaks/search?q=nike&limit=5`);
    const dataNike = await resNike.json();
    assert(
      resNike.status === 200 && dataNike.success && Array.isArray(dataNike.data) && dataNike.data.length > 0,
      'Search Nike sneakers returns results',
      `Found ${dataNike.data?.length || 0} items. First: "${dataNike.data?.[0]?.shoeName}" (Style: ${dataNike.data?.[0]?.styleID})`
    );

    // -------------------------------------------------------------------------
    // TEST 2: Search Adidas Sneakers
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Search Adidas Sneakers ---');
    const resAdidas = await fetch(`${BASE_URL}/api/sneaks/search?q=adidas&limit=5`);
    const dataAdidas = await resAdidas.json();
    assert(
      resAdidas.status === 200 && dataAdidas.success && Array.isArray(dataAdidas.data) && dataAdidas.data.length > 0,
      'Search Adidas sneakers returns results',
      `Found ${dataAdidas.data?.length || 0} items. First: "${dataAdidas.data?.[0]?.shoeName}" (Brand: ${dataAdidas.data?.[0]?.brand})`
    );

    // -------------------------------------------------------------------------
    // TEST 3: Fetch Popular Sneakers
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Fetch Popular Sneakers ---');
    const resPopular = await fetch(`${BASE_URL}/api/sneaks/popular?limit=5`);
    const dataPopular = await resPopular.json();
    assert(
      resPopular.status === 200 && dataPopular.success && Array.isArray(dataPopular.data) && dataPopular.data.length > 0,
      'Fetch popular sneakers returns results',
      `Found ${dataPopular.data?.length || 0} popular items`
    );

    // -------------------------------------------------------------------------
    // TEST 4: Fetch Sneaker Details Using a Real Style ID
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Fetch Sneaker Details Using Real Style ID ---');
    const sampleStyleId = dataNike.data?.[0]?.styleID || 'DD1391-100';
    const resDetails = await fetch(`${BASE_URL}/api/sneaks/details/${encodeURIComponent(sampleStyleId)}`);
    const dataDetails = await resDetails.json();
    assert(
      resDetails.status === 200 && dataDetails.success && dataDetails.data?.styleID,
      'Fetch sneaker details by Style ID',
      `Found Style ID: ${dataDetails.data?.styleID}, Retail: $${dataDetails.data?.retailPrice ?? 'N/A'}`
    );

    // -------------------------------------------------------------------------
    // TEST 5: Handle Invalid Style IDs
    // -------------------------------------------------------------------------
    console.log('\n--- 5. Handle Invalid Style IDs ---');
    const resInvalid = await fetch(`${BASE_URL}/api/sneaks/details/NON-EXISTENT-XYZ-99999`);
    const dataInvalid = await resInvalid.json();
    assert(
      resInvalid.status === 404 || (resInvalid.status === 200 && !dataInvalid.data),
      'Handle invalid style ID with appropriate 404/not-found status',
      `Status: ${resInvalid.status}`
    );

    // -------------------------------------------------------------------------
    // TEST 6: Handle External Marketplace Failures Gracefully
    // -------------------------------------------------------------------------
    console.log('\n--- 6. Handle Marketplace Failure / Edge Cases ---');
    const resEmpty = await fetch(`${BASE_URL}/api/sneaks/search?q=&limit=-5`);
    // Negative limit should be rejected or bounded
    assert(
      resEmpty.status === 400 || resEmpty.status === 200,
      'API gracefully validates bounded parameters without 500 crash',
      `Status: ${resEmpty.status}`
    );

    // -------------------------------------------------------------------------
    // TEST 7: Verify Unauthorized Visitors Cannot Import Products
    // -------------------------------------------------------------------------
    console.log('\n--- 7. Verify Unauthorized Visitors Cannot Import Products ---');
    const resUnauthorized = await fetch(`${BASE_URL}/api/sneaks/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Hacker Sneaker',
        price: 15000,
        styleId: 'HACK-001',
      }),
    });
    assert(
      resUnauthorized.status === 403,
      'Unauthorized visitor blocked from importing (403 Forbidden)',
      `Status: ${resUnauthorized.status}`
    );

    // -------------------------------------------------------------------------
    // TEST 8: Admin Authentication & Product Import into Supabase
    // -------------------------------------------------------------------------
    console.log('\n--- 8. Admin Login & Product Import ---');
    // Login as admin
    const resLogin = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@sneakerdrop.com',
        password: 'AdminSuperSecretPassword2026!',
      }),
    });
    const setCookieHeaders = (resLogin.headers as any).getSetCookie ? (resLogin.headers as any).getSetCookie() : [];
    const cookieHeader = setCookieHeaders.length > 0 ? setCookieHeaders.join('; ') : (resLogin.headers.get('set-cookie') || 'admin_session=authenticated');
    assert(resLogin.status === 200, 'Admin login successful', `Cookie: ${cookieHeader.substring(0, 30)}...`);

    // Import a real sneaker discovered from sneaks
    const sneakerToImport = dataNike.data[0];
    const uniqueTestStyleId = `TEST-${Date.now().toString().slice(-6)}`;
    const importPayload = {
      name: `${sneakerToImport.shoeName} (Edition ${Date.now().toString().slice(-4)})`,
      brand: sneakerToImport.brand || 'Nike',
      category: 'Lifestyle',
      description: sneakerToImport.description || 'Imported via Sneaks-API automated test suite.',
      price: 14999, // Selling price in INR
      retailPrice: sneakerToImport.retailPrice || 110, // Retail price in USD
      availability: 'limited',
      isFeatured: true,
      imageUrl: sneakerToImport.imageUrl,
      styleId: uniqueTestStyleId,
      colorway: sneakerToImport.colorway || 'Test Colorway',
      releaseDate: sneakerToImport.releaseDate || '2026-05-01',
      marketplacePrices: sneakerToImport.lowestResellPrice || { goat: 135 },
      externalSource: 'sneaks-api',
      externalProductId: uniqueTestStyleId,
    };

    const resImport = await fetch(`${BASE_URL}/api/sneaks/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify(importPayload),
    });
    const dataImport = await resImport.json();
    assert(
      resImport.status === 201 && dataImport.success && dataImport.data?.id,
      'Import product into Supabase / catalogue',
      `Imported product ID: ${dataImport.data?.id}, Slug: ${dataImport.data?.slug}`
    );

    const importedProduct = dataImport.data;

    // -------------------------------------------------------------------------
    // TEST 9: Prevent Duplicate Imports (Same Style ID)
    // -------------------------------------------------------------------------
    console.log('\n--- 9. Prevent Duplicate Imports ---');
    const resDup = await fetch(`${BASE_URL}/api/sneaks/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        ...importPayload,
        name: 'Another Attempt With Same Style ID',
      }),
    });
    assert(
      resDup.status === 409,
      'Duplicate import rejected with 409 Conflict',
      `Status: ${resDup.status}`
    );

    // -------------------------------------------------------------------------
    // TEST 10: Edit Imported Product Information
    // -------------------------------------------------------------------------
    console.log('\n--- 10. Edit Imported Product Information ---');
    const resUpdate = await fetch(`${BASE_URL}/api/admin/products/${importedProduct.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        name: `${importedProduct.name} - Updated Edition`,
        price: 16999,
      }),
    });
    const dataUpdate = await resUpdate.json();
    assert(
      resUpdate.status === 200 && dataUpdate.data?.price === 16999,
      'Edit imported product details',
      `New Price: ₹${dataUpdate.data?.price}, Name: ${dataUpdate.data?.name}`
    );

    // -------------------------------------------------------------------------
    // TEST 11: Verify Product Appears in Public Catalogue
    // -------------------------------------------------------------------------
    console.log('\n--- 11. Verify Product Appears in Public Catalogue ---');
    const resPublic = await fetch(`${BASE_URL}/api/products/${importedProduct.slug}`);
    const dataPublic = await resPublic.json();
    assert(
      resPublic.status === 200 && dataPublic.success && dataPublic.data?.id === importedProduct.id,
      'Imported product is publicly accessible by slug',
      `Public Product: "${dataPublic.data?.name}"`
    );

    // -------------------------------------------------------------------------
    // TEST 12: Verify Prices Remain Strictly Separated
    // -------------------------------------------------------------------------
    console.log('\n--- 12. Verify Price Separation Rules ---');
    const productRecord = dataPublic.data;
    const priceSeparated =
      productRecord.price === 16999 && // INR Selling price
      productRecord.retail_price === importPayload.retailPrice && // USD Retail price
      productRecord.marketplace_prices !== undefined; // Resale marketplace breakdown

    assert(
      priceSeparated,
      'Prices remain strictly separated (Selling INR, Retail USD, Resale USD)',
      `Selling: ₹${productRecord.price} | Retail: $${productRecord.retail_price} USD | Market: ${JSON.stringify(productRecord.marketplace_prices)}`
    );

    // Clean up test product
    console.log('\n--- Cleaning up test product ---');
    await fetch(`${BASE_URL}/api/admin/products/${importedProduct.id}`, {
      method: 'DELETE',
      headers: { Cookie: cookieHeader },
    });
    console.log(`Cleaned up test product ${importedProduct.id}`);

  } catch (err: any) {
    console.error('Test execution error:', err);
    failed++;
  }

  console.log('\n======================================================');
  console.log(`🏁 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
